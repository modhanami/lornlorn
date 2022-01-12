import { UserGateway, UserUseCase } from "../ports";

// TODO: Validation for commands and queries
export function createUserService(userGateway: UserGateway): UserUseCase {
  return {
    async create(command) {
      const existingUser = await userGateway.findByUsername(command.username);
      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await userGateway.save({
        email: command.email,
        username: command.username,
        password: command.password,
      });

      return user;
    },

    async findByEmail(query) {
      const user = userGateway.findByEmail(query.email);
      return user;
    },

    async findByUsername(query) {
      const user = userGateway.findByUsername(query.username);
      return user;
    },

    async findById(query) {
      const user = userGateway.findById(query.userId);
      return user;
    },
  }
}
