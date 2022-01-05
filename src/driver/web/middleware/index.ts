import { RequestHandler } from "express"
import { TokenUseCase } from "../../../application/ports"
import sharedMessages from "../shared/sharedMessages";

interface AuthMiddleware {
  verifyToken: RequestHandler;
}

export function createAuthMiddlewares(tokenService: TokenUseCase): AuthMiddleware {
  return {
    async verifyToken(req, res, next) {
      console.log("AUTH");

      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(401).send({
          message: sharedMessages.UNAUTHORIZED,
        });
      }

      const [tokenScheme, token] = authorizationHeader.split(' ');
      if (tokenScheme !== 'Bearer' || !token.trim()) {
        return res.status(401).send({
          message: sharedMessages.UNAUTHORIZED,
        });
      }

      try {
        const decodedToken = await tokenService.verify(token);
        req.user = decodedToken;

        return next();

      } catch (err) {
        return next(err);
      }
    }
  }
}