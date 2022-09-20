
import { Cart } from "../domain/cart";
import { CartItemQuantity } from "../domain/cartItem";
import { Order } from "../domain/order";
import { Product, ProductPrice, ProductTitle } from "../domain/product";
import { RefreshToken } from "../domain/refreshToken";
import { UniqueId, UserEmail, UserToken, UserUsername } from "../domain/sharedKernel";
import { User, UserPassword } from "../domain/user";

// Driven ports

export interface UserGateway {
  save(user: User): Promise<User>;
  findByEmail(email: UserEmail): Promise<User>;
  findByUsername(username: UserUsername): Promise<User>;
  findById(id: UniqueId): Promise<User>;
}

export interface CartGateway {
  save(cart: Cart): Promise<Cart>;
  findById(id: UniqueId): Promise<Cart>;
  findByOwnerId(ownerId: UniqueId): Promise<Cart>;
}

export interface ProductGateway {
  save(product: Product): Promise<Product>;
  findById(id: UniqueId): Promise<Product>;
  findAll(): Promise<Product[]>;
}

export interface RefreshTokenGateway {
  save(token: RefreshToken): Promise<RefreshToken>;
  findByToken(token: UserToken): Promise<RefreshToken>;
}

export interface OrderGateway {
  save(order: Order): Promise<Order>;
  findById(id: UniqueId): Promise<Order>;
  findByOwnerId(ownerId: UniqueId): Promise<Order[]>;
}



// Driver ports

export type CreateUserCommand = {
  email?: UserEmail;
  username: UserUsername;
  password: UserPassword;
};

export interface UserUseCase {
  create(command: CreateUserCommand): Promise<User>;
  findByEmail(email: UserEmail): Promise<User>;
  findByUsername(username: UserUsername): Promise<User>;
  findById(id: UniqueId): Promise<User>;
}



export type AddCartItemCommand = {
  ownerId: UniqueId;
  productId: UniqueId;
  quantity: CartItemQuantity;
};

export interface CartUseCase {
  create(ownerId: UniqueId): Promise<Cart>;
  addCartItem(command: AddCartItemCommand): Promise<Cart>;
  clearCart(ownerId: UniqueId): Promise<Cart>;
  findById(id: UniqueId): Promise<Cart>;
  findByOwnerId(ownerId: UniqueId): Promise<Cart>;
}



export type CreateProductCommand = {
  name: ProductTitle;
  price: ProductPrice;
};

export type FindProductByIdQuery = {
  productId: UniqueId;
};

export interface ProductUseCase {
  create(command: CreateProductCommand): Promise<Product>;
  findById(query: FindProductByIdQuery): Promise<Product>;
  findAll(): Promise<Product[]>;
}



export type AuthenticationCredentials = {
  username: UserUsername;
  password: UserPassword;
}

export type ValidateRefreshTokenCommand = {
  token: UserToken;
};

type ValidateRefreshTokenResult = {
  isValid: boolean;
  userId: UniqueId;
};

export interface TokenUseCase {
  sign(payload: any): Promise<UserToken>;
  verify(token: UserToken): Promise<any>;
  generateRefreshTokenForUser(userId: UniqueId): Promise<RefreshToken>;
  validateRefreshToken(command: ValidateRefreshTokenCommand): Promise<ValidateRefreshTokenResult>;
}

export interface AuthenticationUseCase {
  authenticate(username: UserUsername, password: UserPassword): Promise<{
    accessToken: UserToken;
    refreshToken: RefreshToken;
  }>;
}



export interface PasswordUseCase {
  hash(password: UserPassword): Promise<UserPassword>;
  compare(candidate: UserPassword, hashedPassword: UserPassword): Promise<boolean>;
}



export interface OrderUseCase {
  create(cart: Cart): Promise<Order>;
  findById(orderId: UniqueId): Promise<Order>;
  findByOwnerId(ownerId: UniqueId): Promise<Order[]>;
}