import { PrismaClient } from "@prisma/client";
import { createCartAdapter } from "./cart";
import { createProductAdapter } from "./product";
import { createUserAdapter } from "./user";

const prisma = new PrismaClient();

export const userAdapter = createUserAdapter(prisma);
export const productAdapter = createProductAdapter(prisma);
export const cartAdapter = createCartAdapter(prisma);