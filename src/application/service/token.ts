import crypto from "crypto";
import jwt from 'jsonwebtoken';
import {RefreshTokenGateway, TokenUseCase} from '../ports';

export function createTokenService(refreshTokenGateway: RefreshTokenGateway): TokenUseCase {
  return {
    async sign(payload) {
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    },

    async create(user) {
      return await this.sign({
        id: user.id,
        username: user.username,
      });
    },

    async verify(token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    },

    async renewRefreshToken(ownerId) {
      const expiresAt = new Date();
      const tokenLifetimeInDays = Number(process.env.REFRESH_TOKEN_LIFETIME_IN_DAYS);
      expiresAt.setDate(expiresAt.getDate() + tokenLifetimeInDays);
      console.log(expiresAt);
      
      const tokenLength = Number(process.env.REFRESH_TOKEN_LENGTH);
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