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

    async findByEmail(email) {
      const user = userGateway.findByEmail(email);
      return user;
    },

    async findByUsername(username) {
      const user = userGateway.findByUsername(username);
      return user;
    },

    async findById(id) {
      const user = userGateway.findById(id);
      return user;
    },
  }
}
