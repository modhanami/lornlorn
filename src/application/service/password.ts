import bcrypt from 'bcrypt';
import { PasswordUseCase } from '../../application/ports';

export function createPasswordService(): PasswordUseCase {
  return {
    async compare(candidate, hashedPassword) {
      return bcrypt.compare(candidate, hashedPassword);
    },

    async hash(password) {
      return bcrypt.hash(password, 10);
    }
  }
}