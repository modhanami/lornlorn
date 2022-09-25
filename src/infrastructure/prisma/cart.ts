import { Cart as PrismaCart, CartItem as PrismaCartItem, PrismaClient, Product as PrismaProduct, User as PrismaUser } from "@prisma/client";
import { CartGateway } from "../../application/ports";
import { Cart } from "../../domain/cart";

type PrismaFullyIncluded = PrismaCart & {
  user: PrismaUser;
  cartItems: (PrismaCartItem & {
    product: PrismaProduct;
  })[];
};

export function createCartAdapter(prisma: PrismaClient): CartGateway {
  return {
    async save(cart) {
      if (cart.id === undefined) {
        const newCart = await prisma.cart.create({
          data: {
            user: { connect: { id: cart.owner.id } },
            cartItems: {
              create: cart.items.map(item => ({
                product: { connect: { id: item.product.id } },
                quantity: item.quantity
              }))
            }
          },
          include: {
            user: true,
            cartItems: {
              include: {
                product: true
              }
            }
          }
        });

        return newCart && mapPrismaCartFullyIncludedToDomain(newCart);
      }

      const existingCart = await prisma.cart.findFirst({
        where: {
          id: cart.id,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            }
          },
        },
      });
      if (!existingCart) {
        throw new Error("Cart does not exist");
      }

      // create cart, then add new cart items or update existing cart items
      const existingCartItems = existingCart.cartItems;
      const existingCartItemIds = existingCartItems.map((item) => item.id);
      const newCartItems = cart.items;
      const newCartItemsIds = newCartItems.map((item) => item.id);

      const cartItemsToUpdate = newCartItems.filter((item) => item.id && existingCartItemIds.includes(item.id));
      const cartItemsToCreate = newCartItems.filter((item) => !item.id || !existingCartItemIds.includes(item.id));
      const cartItemsToDelete = existingCartItems.filter((item) => !newCartItemsIds.includes(item.id));

      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            update: cartItemsToUpdate.map((item) => {
              const existingItem = existingCartItems.find((existingItem) => existingItem.id === item.id);

              return {
                where: { id: item.id },
                data: {
                  quantity: item.quantity === existingItem?.quantity
                    ? undefined
                    : item.quantity,
                }
              }
            }),
            create: cartItemsToCreate.map((item) => ({
              product: { connect: { id: item.product.id } },
              quantity: item.quantity,
            })),
            delete: cartItemsToDelete.map((item) => ({ id: item.id })),
          },
        },
        include: {
          user: true,
          cartItems: {
            include: {
              product: true,
            },
          }
        },
      });

      return updatedCart && mapPrismaCartFullyIncludedToDomain(updatedCart);
    },

    async findById(id) {
      const cart = await prisma.cart.findFirst({
        where: { id },
        include: {
          user: true,
          cartItems: {
            include: {
              product: true,
            },
          }
        }
      });

      return cart && mapPrismaCartFullyIncludedToDomain(cart);
    },

    async findByOwnerId(ownerId) {
      const cart = await prisma.cart.findFirst({
        where: { user: { id: ownerId } },
        include: {
          user: true,
          cartItems: {
            include: {
              product: true,
            },
          }
        }
      });

      return cart && mapPrismaCartFullyIncludedToDomain(cart);
    }
  }
}

function mapPrismaCartFullyIncludedToDomain(prismaCart: PrismaFullyIncluded): Cart {
  return {
    id: prismaCart.id,
    owner: prismaCart.user,
    items: prismaCart.cartItems.map(item => ({
      id: item.id,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price)
      },
      quantity: item.quantity
    }))
  }
}