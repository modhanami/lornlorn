import { RequestHandler } from "express";
import { AuthenticationUseCase, CreateUserCommand, FindUserByEmailQuery, FindUserByUsernameQuery, PasswordUseCase, UserUseCase } from "../../../application/ports";
import { mapUserResponse } from "../mapper";
import sharedMessages from "../shared/sharedMessages";

const messages = {
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  USER_CREATED: "User created",
  USER_CREATION_FAILED: "Failed to create user",
  INVALID_CREDENTIALS: "Either username or password is invalid",
}



interface UserController {
  signup: RequestHandler;
  login: RequestHandler;
  findByEmail: RequestHandler;
  findByUsername: RequestHandler;
}

export function createUserController(
  userService: UserUseCase,
  authenticationService: AuthenticationUseCase,
  passwordService: PasswordUseCase
): UserController {
  return {
    async signup(req, res, next) {
      const { email, username, password } = req.body;
      if (!email || !username || !password) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const existingUser = await userService.findByUsername({ username });
        if (existingUser) {
          return res.status(409).send({
            message: messages.USER_ALREADY_EXISTS,
          });
        }

        const hashedPassword = await passwordService.hash(req.body.password);
        const command: CreateUserCommand = {
          email,
          username,
          password: hashedPassword,
        };

        const user = await userService.create(command);
        if (!user) {
          return res.status(500).send({
            message: messages.USER_CREATION_FAILED,
          });
        }

        return res.send(mapUserResponse(user));

      } catch (err) {
        return next(err);
      }
    },

    async login(req, res, next) {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const { accessToken, refreshToken } = await authenticationService.authenticate(username, password);

        res.cookie('refreshToken', refreshToken.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires: refreshToken.expiresAt,
        });

        return res.send({
          accessToken,
        });

      } catch (err) {
        return next(err);
      }
    },

    async findByEmail(req, res, next) {
      const { email } = req.params;
      if (!email) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const query: FindUserByEmailQuery = {
          email,
        };

        const user = await userService.findByEmail(query);
        if (req.user.id !== user.id) {
          return res.status(403).send({
            message: sharedMessages.FORBIDDEN,
          });
        }
        if (!user) {
          return res.status(404).send({
            message: messages.USER_NOT_FOUND,
          });
        }

        return res.send(mapUserResponse(user));

      } catch (err) {
        return next(err);
      }
    },

    async findByUsername(req, res, next) {
      const { username } = req.params;
      if (!username) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const query: FindUserByUsernameQuery = {
          username: req.params.username,
        };

        const user = await userService.findByUsername(query);
        if (req.user.id !== user.id) {
          return res.status(403).send({
            message: sharedMessages.FORBIDDEN,
          });
        }
        if (!user) {
          return res.status(404).send({
            message: messages.USER_NOT_FOUND,
          });
        }

        return res.send(mapUserResponse(user));

      } catch (err) {
        return next(err);
      }
    }
  }
}
