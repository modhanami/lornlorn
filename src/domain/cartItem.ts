import { Product } from "./product";
import { UniqueId } from "./sharedKernel";

export type CartItemQuantity = number;

export type CartItem = {
  id: UniqueId;
  product: Product;
  quantity: CartItemQuantity;
}

export function getCartItemTotal(item: CartItem): number {
  return item.product.price * item.quantity;
}