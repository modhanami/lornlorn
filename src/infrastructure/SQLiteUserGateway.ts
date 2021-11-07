import { PrismaClient, User as UserPrisma } from "@prisma/client";
import { createUserInteractor } from "../application/AddToCart";
import { UserGateway } from "../application/gateway";
import { User } from "../entity/user";
const prisma = new PrismaClient();

function userFromPrisma(user: UserPrisma): User {
  return new User(user.username, user.password, user.email);
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
      username: user.getUsername(),
      password: user.getPasswordHash(),
      email: user.getEmail(),
    };

    await prisma.user.upsert({
      where: {
        username: user.getUsername(),
      },
      update: update,
      create: update,
    });
  },
};

export const sqliteUserInteractor = createUserInteractor(userGateway);