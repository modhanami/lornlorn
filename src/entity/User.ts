export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
}

export function createUser(username: string, password: string, email: string): User {
  return {
    username,
    password,
    email
  };
}

