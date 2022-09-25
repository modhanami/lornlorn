import { RequestHandler } from "express";
import { UserUseCase } from "../../../application/ports";
import { errorMessages } from "../../../application/service/exceptions";
import { mapUserResponse } from "../mapper";
import sharedMessages from "../shared/sharedMessages";

interface UserController {
  findByEmail: RequestHandler;
  findByUsername: RequestHandler;
}

export function createUserController(
  userService: UserUseCase,
): UserController {
  return {
    async findByEmail(req, res, next) {
      const { email } = req.params;
      if (!email) {
        return res.status(400).send({
          message: sharedMessages.MISSING_REQUIRED_FIELDS
        });
      }

      try {
        const user = await userService.findByEmail(email);
        if (!user) {
          return res.status(404).send({
            message: errorMessages.USER_NOT_FOUND
          });
        }

        if (req.user?.id !== user.id) {
          return res.status(403).send({
            message: sharedMessages.FORBIDDEN,
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
        const user = await userService.findByUsername(username);
        if (!user) {
          return res.status(404).send({
            message: errorMessages.USER_NOT_FOUND,
          });
        }
        if (req.user?.id !== user.id) {
          return res.status(403).send({
            message: sharedMessages.FORBIDDEN,
          });
        }

        return res.send(mapUserResponse(user));

      } catch (err) {
        return next(err);
      }
    }
  }
}
