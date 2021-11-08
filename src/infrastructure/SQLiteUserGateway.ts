import { PrismaClient, User as UserPrisma } from "@prisma/client";
import { createUserInteractor } from "../application/interactor";
import { UserGateway } from "../application/gateway";
import { createUser, User } from "../entity/user";
const prisma = new PrismaClient();

function userFromPrisma(user: UserPrisma): User {
  return createUser(user.username, user.email, user.password);
}

const userGateway: UserGateway = {
  async findById(id: number): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    return user ? userFromPrisma(user) : null;
  },
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user ? userFromPrisma(user) : null;
  },
  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    return user ? userFromPrisma(user) : null;
  },
  async save(user: User): Promise<void> {
    const update = {
      username: user.username,
      password: user.password,
      email: user.email,
    };

    await prisma.user.upsert({
      where: {
        username: user.username,
      },
      update: update,
      create: update,
    });
  },
};

export const sqliteUserInteractor = createUserInteractor(userGateway);
