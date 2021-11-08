import { CartItem } from "./CartItem";
import { Product } from "./Product";

export interface Cart {
  id?: number;
  items: CartItem[];
  getTotal(): number;
  addItem(item: CartItem): void;
  addItems(...item: CartItem[]): void;
}

export function createCart(): Cart {
  const _items: CartItem[] = [];
  const cart: Cart = {
    items: _items,
    getTotal() {
      return _items.reduce((acc, item) => acc + item.getTotal(), 0);
    },
    addItem(item: CartItem) {
      _items.push(item);
    },
    addItems(...items: CartItem[]) {
      _items.push(...items);
    },
  };
  return cart;
}
