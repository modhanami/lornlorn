import { AuthenticationUseCase, PasswordUseCase, TokenUseCase, UserGateway } from "../ports";

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

      const payload = {
        userId: user.id,
        username: user.username,
      }

      const signedToken = tokenService.sign(payload);
      return signedToken;
    },
  }
}