import { UniqueId, UserUsername } from "../../domain/sharedKernel";
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

      const payload: UserTokenPayload = {
        id: user.id,
        username: user.username,
      }

      const signedToken = tokenService.sign(payload);
      return signedToken;
    },
  }
}