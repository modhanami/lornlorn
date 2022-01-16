import { PrismaClient } from "@prisma/client";
import { UserGateway } from "../../application/ports";
import { UniqueId, UserEmail, UserUsername } from "../../domain/sharedKernel";
import { User } from "../../domain/user";

export function createUserAdapter(prisma: PrismaClient): UserGateway {
  return {
    async save(user: User): Promise<User> {
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
    async findByEmail(email: UserEmail): Promise<User> {
      return prisma.user.findFirst({ where: { email } });
    },
    async findByUsername(username: UserUsername): Promise<User> {
      return prisma.user.findFirst({ where: { username } });
    },
    async findById(id: UniqueId): Promise<User> {
      return prisma.user.findFirst({ where: { id } });
    }
  };
}