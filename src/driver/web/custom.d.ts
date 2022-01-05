import { JwtPayload } from "jsonwebtoken";
import { UserTokenPayload } from "../../application/service/authentication";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & UserTokenPayload;
    }
  }
}

// declare module 'express' {
//   interface Request {
//     user?: JwtPayload & UserTokenPayload;
//   }
// }