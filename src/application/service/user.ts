import { PasswordUseCase, UserGateway, UserUseCase } from "../ports";

// TODO: Validation for commands and queries
export function createUserService(userGateway: UserGateway, passwordService: PasswordUseCase): UserUseCase {
  return {
    async create(command) {
      const existingUser = await userGateway.findByUsername(command.username);
      if (existingUser) {
        return null;
      }

      const hashedPassword = await passwordService.hash(command.password);
      const user = await userGateway.save({
        email: command.email || null,
        username: command.username,
        password: hashedPassword,
      });

      return user;
    },

    async findByEmail(query) {
      const user = userGateway.findByEmail(query.email);
      return user || null;
    },

    async findByUsername(query) {
      const user = userGateway.findByUsername(query.username);
      return user || null;
    },

    async findById(query) {
      const user = userGateway.findById(query.userId);
      return user || null;
    },
  }
}