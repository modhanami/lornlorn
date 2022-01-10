import { RequestHandler } from "express";
import { TokenUseCase, UserUseCase } from "../../../application/ports";
import sharedMessages from "../shared/sharedMessages";
import { createExpressRefreshTokenCookieArgs, createUserTokenPayload } from "./sharedUtils";

interface TokenController {
  refresh: RequestHandler;
}

export function createTokenController(tokenService: TokenUseCase, userService: UserUseCase): TokenController {
  return {
    async refresh(req, res, next) {
      const { refreshToken: oldRefreshToken } = req.cookies;
      
      if (!oldRefreshToken) {
        return res.status(401).send({
          message: sharedMessages.UNAUTHORIZED,
        });
      }
      
      try {
        const { isValid, userId } = await tokenService.validateRefreshToken({ token: oldRefreshToken });
        console.log(isValid, userId);
        
        if (!isValid) {
          return res.status(401).send({
            message: sharedMessages.UNAUTHORIZED,
          });
        }

        const user = await userService.findById({ userId });
        const payload = createUserTokenPayload(user);

        const newAccessToken = await tokenService.sign(payload);
        const newRefreshToken = await tokenService.generateRefreshTokenForUser(userId);

        res.cookie(...createExpressRefreshTokenCookieArgs(newRefreshToken));

        return res.status(200).send({
          accessToken: newAccessToken,
        });

      } catch (err) {
        return next(err);
      }
    }
  }
}