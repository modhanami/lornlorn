import { PrismaClient, Cart as CartPrisma, CartItem as CartItemPrisma, Product as ProductPrisma } from "@prisma/client";
import { CartGateway } from "../application/gateway";
import { createCartInteractor } from "../application/interactor";
import { Cart, createCart } from "../entity/Cart";
import { CartItem, createCartItem } from "../entity/CartItem";
import { createProduct, Product } from "../entity/Product";
const prisma = new PrismaClient();

type CartIncludedPrisma = CartPrisma & {
  cartItem: (CartItemPrisma & {
    product: ProductPrisma;
  })[]
};

function cartFromPrisma(cart: CartIncludedPrisma): Cart {
  const newCart = createCart();
  newCart.id = cart.id;
  cart.cartItem.forEach(cartItem => {
    newCart.addItem(createCartItem(cartItem.product, cartItem.quantity));
  });
  return newCart;
}

const cartGateway: CartGateway = {
  async findById(id: number): Promise<Cart> {
    const cart = await prisma.cart.findFirst({
      where: {
        id,
      },
      include: {
        cartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    return cart ? cartFromPrisma(cart) : null;
  },
  async save(userId: number, cart: Cart): Promise<void> {
    const cartItemCreate = {
      create: cart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    const update = {
      userId,
      cartItem: cartItemCreate,
    };

    if (cart.items.length === 0) {
      delete update.cartItem;
    }

    await prisma.cart.upsert({
      where: {
        userId,
      },
      update: update,
      create: update,
    });
  },
  async findByUserId(userId: number): Promise<Cart> {
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        cartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    return cart ? cartFromPrisma(cart) : null;
  },
  async addToCart(cart: Cart, cartItem: CartItem): Promise<void> {
    console.log("A")
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        cartItem: {
          create: {
            productId: cartItem.product.id,
            quantity: cartItem.quantity,
            product: {
              create: {
                name: cartItem.product.name,
                price: cartItem.product.price,
              },
            }
          },
        },
      },
    });
  }
};

export const sqliteCartInteractor = createCartInteractor(cartGateway);
