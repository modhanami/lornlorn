import { RequestHandler } from "express";
import { AddCartItemCommand, CartUseCase } from "../../../application/ports";
import { Cart } from "../../../domain/cart";
import { mapCartResponse } from "../mapper";
import sharedMessages from "../shared/sharedMessages";

const messages = {
  CART_NOT_FOUND: 'Cart not found',
};

interface CartController {
  addOwnCartItem: RequestHandler;
  findById: RequestHandler;
  findByOwnerId: RequestHandler;
  findOwnCart: RequestHandler;
}

export function createCartController(cartService: CartUseCase): CartController {

  async function addCartItemForUser(ownerId: number, productId: number, quantity: number): Promise<Cart> {
    let cart: Cart;
    const existingCart = await cartService.findByOwnerId(ownerId);
    if (!existingCart) {
      cart = await cartService.create(ownerId);
    }

    const command: AddCartItemCommand = {
      ownerId,
      productId: productId,
      quantity: quantity,
    };

    cart = await cartService.addCartItem(command);
    return cart;
  }

  return {
    async addOwnCartItem(req, res, next) {
      if (!req.user) {
        return res.status(401).json(sharedMessages.UNAUTHORIZED);
      }
      const { productId, quantity } = req.body;
      const { id: ownerId } = req.user;
      if (!productId || !quantity) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const parsedProductId = Number(productId);
        const parsedQuantity = Number(quantity);
        if (isNaN(parsedProductId) || isNaN(parsedQuantity)) {
          return res.status(400).send({
            message: sharedMessages.MALFORMED_FIELDS
          });
        }

        const updatedCart = await addCartItemForUser(ownerId, parsedProductId, parsedQuantity);

        return res.status(200).send(mapCartResponse(updatedCart));

      } catch (err) {
        return next(err);
      }
    },

    async findById(req, res, next) {
      if (!req.user) {
        return res.status(401).json(sharedMessages.UNAUTHORIZED);
      }
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
          return res.status(400).send({
            message: sharedMessages.MALFORMED_FIELDS
          });
        }

        const cart = await cartService.findById(parsedId);
        if (!cart) {
          return res.status(404).send({
            message: messages.CART_NOT_FOUND
          });
        }
        if (req.user.id !== cart.owner.id) {
          return res.status(403).send({
            message: sharedMessages.FORBIDDEN,
          });
        }

        return res.status(200).send(mapCartResponse(cart));
      } catch (err) {
        return next(err);
      }
    },

    async findByOwnerId(req, res, next) {
      const { ownerId } = req.params;
      if (!ownerId) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const parsedOwnerId = Number(ownerId);
        if (isNaN(parsedOwnerId)) {
          return res.status(400).send({
            message: sharedMessages.MALFORMED_FIELDS
          });
        }

        const cart = await cartService.findByOwnerId(parsedOwnerId);
        if (!cart) {
          return res.status(404).send({
            message: messages.CART_NOT_FOUND
          });
        }
        if (req.user?.id !== cart.owner.id) {
          return res.status(403).send({
            message: sharedMessages.FORBIDDEN,
          });
        }

        return res.status(200).send(mapCartResponse(cart));
      } catch (err) {
        return next(err);
      }
    },

    async findOwnCart(req, res, next) {
      if (!req.user) {
        return res.status(401).json(sharedMessages.UNAUTHORIZED);
      }
      const { id: ownerId } = req.user;
      try {
        const cart = await cartService.findByOwnerId(ownerId);
        if (!cart) {
          return res.status(404).send({
            message: messages.CART_NOT_FOUND,
          });
        }

        return res.status(200).send(mapCartResponse(cart));

      } catch (err) {
        return next(err);
      }
    }
  }
}