import { CartItem } from "./cartItem";
import { UniqueId } from "./sharedKernel";
import { User } from "./user";

export type Cart = {
  id?: UniqueId;
  owner: User;
  items: CartItem[];
};

export function addCartItem(cart: Cart, cartItem: CartItem): Cart {
  const existingItem = cart.items.find((i) => i.product.id === cartItem.product.id);
  if (existingItem) {
    return {
      ...cart,
      items: cart.items.map((currentItem) =>
        currentItem.product.id === cartItem.product.id
          ? { ...currentItem, quantity: currentItem.quantity + cartItem.quantity }
          : currentItem
      ),
    };
  } else {
    return { ...cart, items: [...cart.items, cartItem] };
  }
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}