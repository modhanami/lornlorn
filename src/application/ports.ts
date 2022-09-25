
import { Cart } from "../domain/cart";
import { CartItemQuantity } from "../domain/cartItem";
import { Order } from "../domain/order";
import { Product, ProductPrice, ProductTitle } from "../domain/product";
import { RefreshToken } from "../domain/refreshToken";
import { UniqueId, UserEmail, UserToken, UserUsername } from "../domain/sharedKernel";
import { User, UserPassword } from "../domain/user";

export type MaybeNew<T> = Omit<T, "id"> & { id?: UniqueId };

// Driven ports

export interface UserGateway {
  save(user: MaybeNew<User>): Promise<User>;
  findByEmail(email: UserEmail): Promise<User | null>;
  findByUsername(username: UserUsername): Promise<User | null>;
  findById(id: UniqueId): Promise<User | null>;
}

export interface CartGateway {
  save(cart: MaybeNew<Cart>): Promise<Cart>;
  findById(id: UniqueId): Promise<Cart | null>;
  findByOwnerId(ownerId: UniqueId): Promise<Cart | null>;
}

export interface ProductGateway {
  save(product: MaybeNew<Product>): Promise<Product>;
  findById(id: UniqueId): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}

export interface RefreshTokenGateway {
  save(token: MaybeNew<RefreshToken>): Promise<RefreshToken>;
  findByToken(token: UserToken): Promise<RefreshToken | null>;
}

export interface OrderGateway {
  save(order: MaybeNew<Order>): Promise<Order>;
  findById(id: UniqueId): Promise<Order | null>
  findByOwnerId(ownerId: UniqueId): Promise<Order[]>;
}



// Driver ports

export type CreateUserCommand = {
  email: UserEmail;
  username: UserUsername;
  password: UserPassword;
};

export interface UserUseCase {
  create(command: CreateUserCommand): Promise<User>;
  findByEmail(email: UserEmail): Promise<User | null>
  findByUsername(username: UserUsername): Promise<User | null>;
  findById(id: UniqueId): Promise<User | null>;
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
  findById(id: UniqueId): Promise<Cart | null>;
  findByOwnerId(ownerId: UniqueId): Promise<Cart | null>;
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
  findById(query: FindProductByIdQuery): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}



export type AuthenticationCredentials = {
  username: UserUsername;
  password: UserPassword;
}

export type ValidateRefreshTokenCommand = {
  token: UserToken;
};

type ValidateRefreshTokenResult = {isValid: true, userId: UniqueId} | {isValid: false, userId: null};

export interface TokenUseCase {
  sign(payload: any): Promise<UserToken>;
  create(user: User): Promise<UserToken>;
  verify(token: UserToken): Promise<any>;
  renewRefreshToken(userId: UniqueId): Promise<RefreshToken>;
  validateRefreshToken(command: ValidateRefreshTokenCommand): Promise<ValidateRefreshTokenResult>;
}

type RegisterRequest = {
    email: UserEmail;
    username: UserUsername;
    password: UserPassword;
}

export interface AuthenticationUseCase {
  authenticate(username: UserUsername, password: UserPassword): Promise<User>;
  register(request: RegisterRequest): Promise<User>;
}



export interface PasswordUseCase {
  hash(password: UserPassword): Promise<UserPassword>;
  compare(candidate: UserPassword, hashedPassword: UserPassword): Promise<boolean>;
}



export interface OrderUseCase {
  create(cart: Cart): Promise<Order>;
  findById(orderId: UniqueId): Promise<Order | null>;
  findByOwnerId(ownerId: UniqueId): Promise<Order[]>;
}