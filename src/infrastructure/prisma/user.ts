import { PrismaClient } from "@prisma/client";
import { UserGateway } from "../../application/ports";

export function createUserAdapter(prisma: PrismaClient): UserGateway {
  return {
    async save(user) {
      // if user has id, update, else create
      return prisma.user.upsert({
        where: { id: user.id || -1 },
        update: {
          email: user.email,
          username: user.username,
          password: user.password,
        },
        create: {
          email: user.email,
          username: user.username,
          password: user.password,
        },
      });
    },
    async findByEmail(email) {
      return prisma.user.findFirst({ where: { email } });
    },
    async findByUsername(username) {
      return prisma.user.findFirst({ where: { username } });
    },
    async findById(id) {
      return prisma.user.findFirst({ where: { id } });
    }
  };
}