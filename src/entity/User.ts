export class User {
  private username: string;
  private passwordHash: string;
  private email: string;

  constructor(username: string, passwordHash: string, email: string) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.email = email;
  }

  getUsername(): string {
    return this.username;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getEmail(): string {
    return this.email;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  setPasswordHash(passwordHash: string): void {
    this.passwordHash = passwordHash;
  }

  setEmail(email: string): void {
    this.email = email;
  }
}
