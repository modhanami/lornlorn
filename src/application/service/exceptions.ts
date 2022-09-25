export const errorMessages = {
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  USER_CREATED: "User created",
  USER_CREATION_FAILED: "Failed to create user",
  INVALID_CREDENTIALS: "Invalid credentials",
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super(errorMessages.USER_ALREADY_EXISTS);
  }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super(errorMessages.INVALID_CREDENTIALS);
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super(errorMessages.USER_NOT_FOUND);
    }
}