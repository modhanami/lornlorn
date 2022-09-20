import { RequestHandler } from "express";
import { CartUseCase, OrderUseCase } from "../../../application/ports";
import { mapOrderResponse } from "../mapper";

interface CheckoutController {
  checkout: RequestHandler;
}

export function createCheckoutController(orderService: OrderUseCase, cartService: CartUseCase): CheckoutController {
  return {
    checkout: async (req, res, next) => {
      const { id } = req.user;
      const parsedId = Number(id);

      try {
        const cart = await cartService.findByOwnerId(parsedId);
        const order = await orderService.create(cart);
        await cartService.clearCart(parsedId);

        return res.status(200).send(mapOrderResponse(order));

      } catch (err) {
        return next(err);
      }
    }
  };
}