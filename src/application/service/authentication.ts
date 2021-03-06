import { UniqueId, UserUsername } from "../../domain/sharedKernel";
import { createUserTokenPayload } from "../../driver/web/controller/sharedUtils";
import { AuthenticationUseCase, PasswordUseCase, TokenUseCase, UserGateway } from "../ports";

export type UserTokenPayload = {
  id: UniqueId;
  username: UserUsername;
};

export function createAuthenticationService(userGateway: UserGateway, passwordService: PasswordUseCase, tokenService: TokenUseCase): AuthenticationUseCase {
  return {
    async authenticate(username, password) {
      const user = await userGateway.findByUsername(username);
      if (!user) {
        return null;
      }

      const isPasswordValid = await passwordService.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      const payload = createUserTokenPayload(user);

      const accessToken = await tokenService.sign(payload);
      const refreshToken = await tokenService.generateRefreshTokenForUser(user.id);

      return {
        accessToken,
        refreshToken,
      }
    },
  }
}