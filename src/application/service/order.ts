import { Order } from "../../domain/order";
import { MaybeNew, OrderGateway, OrderUseCase } from "../ports";

export function createOrderService(orderGateway: OrderGateway): OrderUseCase {
  return {
    async create(cart) {
      if (cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const order: MaybeNew<Order> = {
        user: cart.owner,
        items: cart.items,
        status: "pending",
      };

      return await orderGateway.save(order);
    },

    async findById(orderId) {
      return await orderGateway.findById(orderId);
    },

    async findByOwnerId(ownerId) {
      return await orderGateway.findByOwnerId(ownerId);
    }
  }
}