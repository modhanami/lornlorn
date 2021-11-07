import { Product } from "./Product";

export interface CartItem {
  product: Product;
  quantity: number;
  getTotal(): number;
}

export function createCartItem(product: Product, quantity: number): CartItem {
  return {
    product,
    quantity,
    getTotal() {
      return this.product.price * this.quantity;
    },
  };
}
