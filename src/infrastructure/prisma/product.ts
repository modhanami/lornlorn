import { PrismaClient } from "@prisma/client";
import { ProductGateway } from "../../application/ports";
import { Product } from "../../domain/product";
import { UniqueId } from "../../domain/sharedKernel";

export function createProductAdapter(prisma: PrismaClient): ProductGateway {
  return {
    async save(product: Product): Promise<Product> {
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

    async findById(id: UniqueId): Promise<Product> {
      const existingProduct = await prisma.product.findFirst({ where: { id } });
      return {
        id: existingProduct.id,
        name: existingProduct.name,
        price: Number(existingProduct.price.toString()),
      }
    }
  };
}