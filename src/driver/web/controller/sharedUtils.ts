import { CookieOptions } from "express";
import { UserTokenPayload } from "../../../application/service/auth";
import { RefreshToken } from "../../../domain/refreshToken";
import { User } from "../../../domain/user";

export function createUserTokenPayload(user: User): UserTokenPayload {
  return {
    id: user.id,
    username: user.username,
  };
}

export function createExpressRefreshTokenCookieArgs(refreshToken: RefreshToken): [string, string, CookieOptions] {
  return ['refreshToken', refreshToken.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: refreshToken.expiresAt,
  }];
}