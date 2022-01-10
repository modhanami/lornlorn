import { PrismaClient, RefreshToken as PrismaRefreshToken } from '@prisma/client';
import { RefreshTokenGateway } from "../../application/ports";
import { RefreshToken } from "../../domain/refreshToken";

function mapToDomain(prismaRefreshToken: PrismaRefreshToken): RefreshToken {
  return {
    id: prismaRefreshToken.id,
    token: prismaRefreshToken.token,
    expiresAt: prismaRefreshToken.expiresAt,
    ownerId: prismaRefreshToken.userId,
  };
}

export function createRefreshTokenAdapter(prisma: PrismaClient): RefreshTokenGateway {
  return {
    async save(refreshToken: RefreshToken): Promise<RefreshToken> {
      const { token, expiresAt, ownerId } = refreshToken;
      const result = await prisma.refreshToken.upsert({
        where: { userId: ownerId },
        update: {
          token,
          expiresAt,
        },
        create: {
          token,
          expiresAt,
          userId: ownerId,
        }
      });

      return mapToDomain(result);
    },

    async findByToken(token: string): Promise<RefreshToken> {
      const result = await prisma.refreshToken.findFirst({ where: { token } });
      return result && mapToDomain(result);
    }
  };
}