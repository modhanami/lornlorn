import { RequestHandler } from "express";
import { CartUseCase, OrderUseCase } from "../../../application/ports";
import { mapOrderResponse } from "../mapper";
import sharedMessages from "../shared/sharedMessages";

interface CheckoutController {
  checkout: RequestHandler;
}

export function createCheckoutController(orderService: OrderUseCase, cartService: CartUseCase): CheckoutController {
  return {
    checkout: async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: sharedMessages.UNAUTHORIZED });
      }
      const { id } = req.user;
      const parsedId = Number(id);

      try {
        const cart = await cartService.findByOwnerId(parsedId);
        if (!cart) {
          return res.status(404).send({
            message: 'Cart not found',
          });
        }
        const order = await orderService.create(cart);
        await cartService.clearCart(parsedId);

        return res.status(200).send(mapOrderResponse(order));

      } catch (err) {
        return next(err);
      }
    }
  };
}