import jwt from 'jsonwebtoken';
import { TokenUseCase } from '../ports';

export function createTokenService(): TokenUseCase {
  return {
    async sign(payload) {
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    },

    async verify(token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
  }
}