import { MaybeNew } from "../application/ports";
import { CartItem } from "./cartItem";
import { UniqueId } from "./sharedKernel";
import { User } from "./user";

export type Cart = {
  id: UniqueId;
  owner: User;
  items: MaybeNew<CartItem>[];
};

// currently a pure function, but the cost might not be worth it
export function addCartItem(cart: Cart, cartItem: MaybeNew<CartItem>): Cart {
  const { product: { id: productId }, quantity } = cartItem;
  const existingItem = cart.items.find((i) => i.product.id === productId);
  if (!existingItem && quantity <= 0) {
    return cart;
  }
  
  let newItems: MaybeNew<CartItem>[];
  if (existingItem) {
    newItems = cart.items.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
      .filter((item) => item.quantity > 0);
  } else {
    newItems = [...cart.items, cartItem];
  }

  return {
    ...cart,
    items: newItems,
  }
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}