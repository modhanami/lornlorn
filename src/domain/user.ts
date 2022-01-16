import { UniqueId, UserEmail, UserToken, UserUsername } from "./sharedKernel";

export type User = {
  id?: UniqueId;
  username: UserUsername;
  password: UserPassword;
  email: UserEmail;
  refreshToken?: UserToken;
};

export type UserPassword = string;