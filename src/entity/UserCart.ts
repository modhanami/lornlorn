import { Cart } from "./Cart";
import { createCartItem } from "./CartItem";
import { Product } from "./Product";
import { User } from "./user";

export interface UserCart {
  user: User;
  cart: Cart;
  addToCart(product: Product, quantity: number): Promise<void>;
}

export function createUserCart(user: User, cart: Cart): UserCart {
  return {
    user,
    cart,
    async addToCart(product: Product, quantity: number): Promise<void> {
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      const cartItem = cart.items.find(
        (item) => item.product.name === product.name
      );

      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cart.addItem(createCartItem(product, quantity));
      }
    },
  };
}
