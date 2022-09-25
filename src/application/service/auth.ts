import {UniqueId, UserUsername} from "../../domain/sharedKernel";
import {AuthenticationUseCase, PasswordUseCase, UserUseCase} from "../ports";
import {InvalidCredentialsError, UserAlreadyExistsError, UserNotFoundError} from "./exceptions";

export type UserTokenPayload = {
  id: UniqueId;
  username: UserUsername;
};

export function createAuthenticationService(userService: UserUseCase, passwordService: PasswordUseCase): AuthenticationUseCase {
  return {
    async authenticate(username, password) {
      const user = await userService.findByUsername(username);
      if (!user) {
        throw new UserNotFoundError();
      }

      const isPasswordValid = await passwordService.compare(password, user.password);
      if (!isPasswordValid) {
        throw new InvalidCredentialsError();
      }

      return user;
    },

    async register(request) {
      const user = await userService.findByUsername(request.username);
      if (user) {
        throw new UserAlreadyExistsError();
      }

      const hashedPassword = await passwordService.hash(request.password);

      return await userService.create({
        email: request.email,
        username: request.username,
        password: hashedPassword,
      })
    }
  }
}