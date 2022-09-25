import { CookieOptions } from "express";
import { RefreshToken } from "../../../domain/refreshToken";

export function createExpressRefreshTokenCookieArgs(refreshToken: RefreshToken): [string, string, CookieOptions] {
  return ['refreshToken', refreshToken.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: refreshToken.expiresAt,
  }];
}