import { UniqueId, UserToken } from "./sharedKernel";

export type RefreshToken = {
  id?: UniqueId;
  token: UserToken;
  expiresAt: Date;
  ownerId: UniqueId;
}