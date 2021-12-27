import { UserEmail, UniqueId, UserUsername } from "./sharedKernel";

export type User = {
  id?: UniqueId;
  username: UserUsername;
  password: UserPassword;
  email: UserEmail;
};

export type UserPassword = string;