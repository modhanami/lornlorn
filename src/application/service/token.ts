import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { RefreshTokenGateway, TokenUseCase } from '../ports';

type TokenServiceOptions = {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenLength: number;
  refreshTokenMaxAgeSeconds: number;
};

export function createTokenService(refreshTokenGateway: RefreshTokenGateway, options: TokenServiceOptions): TokenUseCase {
  const { accessTokenSecret, accessTokenExpiresIn, refreshTokenLength, refreshTokenMaxAgeSeconds } = options;
  if (!accessTokenSecret || !accessTokenExpiresIn || !refreshTokenLength || !refreshTokenMaxAgeSeconds) {
    throw new Error('TokenServiceOptions are not valid');
  }
  return {
    async sign(payload) {
      return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiresIn });
    },

    async create(user) {
      return await this.sign({
        id: user.id,
        username: user.username,
      });
    },

    async verify(token) {
      return jwt.verify(token, accessTokenSecret);
    },

    async renewRefreshToken(ownerId) {
      const expiresAt = new Date();
      const tokenLifetimeInDays = Number(refreshTokenMaxAgeSeconds) / 60 / 60 / 24;
      expiresAt.setDate(expiresAt.getDate() + tokenLifetimeInDays);
      console.log(expiresAt);
      
      const tokenLength = Number(refreshTokenLength);
      const bytesNeeded = Math.ceil(tokenLength / (4 / 3));
      const refreshToken = crypto.randomBytes(bytesNeeded).toString('base64url');

      return await refreshTokenGateway.save({
        token: refreshToken,
        expiresAt,
        ownerId,
      });
    },

    async validateRefreshToken(command) {
      const refreshToken = await refreshTokenGateway.findByToken(command.token);
      const currentTime = new Date();
      
      if (!refreshToken || refreshToken.expiresAt < currentTime) {
        return {
          isValid: false,
          userId: null,
        }
      }

      const isValid = refreshToken.token === command.token;
      if (!isValid) {
        return {
          isValid: false,
          userId: null,
        }
      }

      return {
        isValid: true,
        userId: refreshToken.ownerId,
      };
    }
  }
}