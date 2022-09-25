import { MaybeNew } from "../application/ports";
import { Product } from "./product";
import { UniqueId } from "./sharedKernel";
import { User } from "./user";

export type Order = {
  id: UniqueId;
  user: User;
  items: MaybeNew<OrderItem>[];
  status: OrderStatus;
};

export type OrderItem = {
  id: UniqueId;
  product: Product;
  quantity: number;
};

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered";

export function getOrderTotal(order: MaybeNew<Order>): number {
  return order.items.reduce((total, item) => {
    return total + getOrderItemSubtotal(item);
  }, 0);
}

export function getOrderItemSubtotal(item: MaybeNew<OrderItem>): number {
  return item.product.price * item.quantity;
}