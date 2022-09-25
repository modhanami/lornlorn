import { PrismaClient } from "@prisma/client";
import { ProductGateway } from "../../application/ports";

export function createProductAdapter(prisma: PrismaClient): ProductGateway {
  return {
    async save(product) {
      const upsertProduct = await prisma.product.upsert({
        where: { id: product.id || -1 },
        update: {
          name: product.name,
          price: product.price,
        },
        create: {
          name: product.name,
          price: product.price,
        },
      });

      return {
        id: upsertProduct.id,
        name: upsertProduct.name,
        price: Number(upsertProduct.price.toString()),
      }
    },

    async findById(id) {
      const existingProduct = await prisma.product.findFirst({ where: { id } });
      if (!existingProduct) {
        return null;
      }

      return {
        id: existingProduct.id,
        name: existingProduct.name,
        price: Number(existingProduct.price.toString()),
      }
    },

    async findAll() {
      const existingProducts = await prisma.product.findMany();
      return existingProducts.map((existingProduct) => ({
        id: existingProduct.id,
        name: existingProduct.name,
        price: Number(existingProduct.price.toString()),
      }));
    }
  };
}