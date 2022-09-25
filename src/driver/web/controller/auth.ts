import {RequestHandler} from "express";
import sharedMessages from "../shared/sharedMessages";
import {AuthenticationUseCase, TokenUseCase, UserUseCase} from "../../../application/ports";
import {
  errorMessages,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  UserNotFoundError
} from "../../../application/service/exceptions";
import {User} from "../../../domain/user";
import {Response} from "express-serve-static-core";
import {RefreshToken} from "../../../domain/refreshToken";

interface AuthController {
  register: RequestHandler;
  login: RequestHandler;
  getUserinfo: RequestHandler;
  refreshToken: RequestHandler;
}

export function createAuthController(authService: AuthenticationUseCase, tokenService: TokenUseCase, userService: UserUseCase): AuthController {
  return {
    async register(req, res) {
      const {email, username, password} = req.body;
      console.log(req.body)
      if (!email || !username || !password) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      let user: User;
      try {
        user = await authService.register({email, username, password});
      } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
          return res.status(409).send({
            message: errorMessages.USER_ALREADY_EXISTS
          });
        }

        console.log(err);
        return res.status(500);
      }

      return res.status(201);
    },

    async login(req, res) {
      const {username, password} = req.body;
      if (!username || !password) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      let user: User;
      try {
        user = await authService.authenticate(username, password);
      } catch (err) {
        if (err instanceof UserNotFoundError || err instanceof InvalidCredentialsError) {
          return res.status(401).send({
            message: errorMessages.INVALID_CREDENTIALS,
          });
        }

        return res.status(500);
      }

      const accessToken = await tokenService.create(user);
      const refreshToken = await tokenService.renewRefreshToken(user.id);

      setRefreshTokenCookie(res, refreshToken);

      return res.send({
        type: "Bearer",
        accessToken,
      });
    },

    async getUserinfo(req, res) {
      const user = req.user;
      return res.send(user);
    },

    async refreshToken(req, res) {
      const {refreshToken} = req.cookies;
      if (!refreshToken) {
        return res.status(401).send({
          message: sharedMessages.UNAUTHORIZED,
        });
      }

      try {
        const {isValid, userId} = await tokenService.validateRefreshToken({token: refreshToken});
        console.log(isValid, userId);
        if (!isValid) {
          return res.status(401).send({
            message: sharedMessages.UNAUTHORIZED,
          });
        }

        const user = await userService.findById(userId);
        const newAccessToken = await tokenService.create(user);

        return res.status(200).send({
          accessToken: newAccessToken,
        });
      } catch (err) {
        return res.status(500);
      }
    }
  }
}

function setRefreshTokenCookie(res: Response, refreshToken: RefreshToken) {
  const isSecureCookieDisabled = process.env.DISABLE_SECURE_COOKIES === "true";
  console.log(isSecureCookieDisabled)
  res.cookie('refreshToken', refreshToken.token, {
    httpOnly: true,
    secure: !isSecureCookieDisabled,
    sameSite: 'strict',
    expires: refreshToken.expiresAt,
  });
}