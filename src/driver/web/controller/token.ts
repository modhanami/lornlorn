import { RequestHandler } from "express";
import { TokenUseCase, UserUseCase } from "../../../application/ports";
import { UserTokenPayload } from "../../../application/service/authentication";
import sharedMessages from "../shared/sharedMessages";

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
        const payload: UserTokenPayload = {
          id: user.id,
          username: user.username,
        }

        const newAccessToken = await tokenService.sign(payload);
        const newRefreshToken = await tokenService.generateRefreshTokenForUser(userId);

        res.cookie('refreshToken', newRefreshToken.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: newRefreshToken.expiresAt,
        });

        return res.status(200).send({
          accessToken: newAccessToken,
        });

      } catch (err) {
        return next(err);
      }
    }
  }
}