import { PrismaClient } from "@prisma/client";
import { CartGateway } from "../../application/ports";
import { Cart } from "../../domain/cart";
import { UniqueId } from "../../domain/sharedKernel";

export function createCartAdapter(prisma: PrismaClient): CartGateway {
  return {
    async save(cart: Cart): Promise<Cart> {
      // if cart has id, update, else create
      if (cart.id !== undefined && cart.id !== null) {
        // create cart, then add new cart items or update existing cart items
        const newCartItems = cart.items.filter((item) => !item.id);
        const updateCartItems = cart.items.filter((item) => item.id);

        const existingCart = await prisma.cart.update({
          where: { id: cart.id },
          data: {
            cartItems: {
              update: updateCartItems.map((item) => ({
                where: { id: item.id },
                data: {
                  quantity: item.quantity,
                },
              })),
              create: newCartItems.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
              })),
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

        if (!existingCart) {
          return null;
        }

        return {
          id: existingCart.id,
          owner: existingCart.user,
          items: existingCart.cartItems.map((item) => ({
            id: item.id,
            product: {
              id: item.product.id,
              name: item.product.name,
              price: Number(item.product.price),
            },
            quantity: item.quantity,
          })),
        };
      } else {
        // create cart, cart items. Then connect to a user, and products
        const newCart = await prisma.cart.create({
          data: {
            user: { connect: { id: cart.owner.id } },
            cartItems: {
              create: cart.items.map(item => ({
                product: { connect: { id: item.product.id } },
                quantity: item.quantity
              }))
            }
          }
        });

        if (!newCart) {
          return null;
        }

        return {
          id: newCart.id,
          owner: cart.owner,
          items: cart.items
        };
      }
    },

    async findById(id: UniqueId): Promise<Cart> {
      const cart = await prisma.cart.findFirst({
        where: { id },
        include: {
          cartItems: {
            include: {
              product: true
            }
          },
          user: true
        }
      });

      if (!cart) {
        return null;
      }

      return {
        id: cart.id,
        owner: cart.user,
        items: cart.cartItems.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price) // item.product.price.toNumber() somehow isn't a function
          },
          quantity: item.quantity
        }))
      }
    },

    async findByOwnerId(ownerId: UniqueId): Promise<Cart> {
      const cart = await prisma.cart.findFirst({
        where: { user: { id: ownerId } },
        include: {
          cartItems: {
            include: {
              product: true
            }
          },
          user: true
        }
      });

      if (!cart) {
        return null;
      }

      return {
        id: cart.id,
        owner: cart.user,
        items: cart.cartItems.map(item => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price.toString())
          },
          quantity: item.quantity
        }))
      }
    }
  }
}