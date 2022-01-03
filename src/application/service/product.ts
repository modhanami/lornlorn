import { ProductGateway, ProductUseCase } from "../ports";

// TODO: Validation for commands and queries
export function createProductService(productGateway: ProductGateway): ProductUseCase {
  return {
    async create(command) {
      const product = await productGateway.save({
        name: command.name,
        price: command.price,
      });

      return product;
    },

    async findById(query) {
      const product = productGateway.findById(query.productId);
      return product || null;
    },

    async findAll() {
      const products = await productGateway.findAll();
      return products || [];
    }
  };
}