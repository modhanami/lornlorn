import { Product } from "./Product";

export class Cart {
  private items: Array<CartItem>;
  private total: number = 0;

  constructor(products: Array<CartItem>) {
    this.items = products;
  }

  getItems(): Array<CartItem> {
    return this.items;
  }

  getTotal(): number {
    return this.total;
  }

  addItem(item: CartItem): void {
    this.items.push(item);
    this.total += item.getProduct().getPrice();
  }
}

export class CartItem {
  private product: Product;
  private quantity: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }

  getProduct(): Product {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  getTotal(): number {
    return this.product.getPrice() * this.quantity;
  }
}
