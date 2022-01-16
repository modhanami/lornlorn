import { RequestHandler } from "express";
import { CreateProductCommand, ProductUseCase } from "../../../application/ports";
import { Product } from "../../../domain/product";
import { mapProductResponse } from "../mapper";
import sharedMessages from "../shared/sharedMessages";

const messages = {
  PRODUCT_ALREADY_EXISTS: 'Product already exists',
  PRODUCT_CREATED: 'Product created',
  PRODUCT_CREATION_FAILED: 'Failed to create product',
  PRODUCT_NOT_FOUND: 'Product not found',
};



interface ProductController {
  create: RequestHandler;
  findById: RequestHandler;
  findAll: RequestHandler;
}

export function createProductController(
  productService: ProductUseCase
): ProductController {
  return {
    async create(req, res, next) {
      const { name, price } = req.body;
      if (!name || !price) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const command: CreateProductCommand = {
          name,
          price,
        };

        const product = await productService.create(command);
        if (!product) {
          return res.status(500).send({
            message: messages.PRODUCT_CREATION_FAILED,
          });
        }

        return res.status(201).send(mapProductResponse(product));

      } catch (err) {
        return next(err);
      }
    },

    async findById(req, res, next) {
      const { productId: id } = req.params;
      if (!id) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const parsedProductId = Number(id);
        if (isNaN(parsedProductId)) {
          return res.status(400).send({
            message: sharedMessages.MALFORMED_FIELDS
          });
        }

        const product = await productService.findById({ productId: parsedProductId });
        if (!product) {
          return res.status(404).send({
            message: messages.PRODUCT_NOT_FOUND,
          });
        }

        return res.status(200).send(mapProductResponse(product));

      } catch (err) {
        return next(err);
      }
    },

    async findAll(req, res, next) {
      try {
        const products = await productService.findAll();
        return res.status(200).send(products.map(mapProductResponse));

      } catch (err) {
        return next(err);
      }
    }
  }
}