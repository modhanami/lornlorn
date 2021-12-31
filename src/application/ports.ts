
import { Cart } from "../domain/cart";
import { CartItemQuantity } from "../domain/cartItem";
import { Product, ProductPrice, ProductTitle } from "../domain/product";
import { UniqueId, UserToken, UserEmail, UserUsername } from "../domain/sharedKernel";
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
}



// Driver ports

export type CreateUserCommand = {
  email?: UserEmail;
  username: UserUsername;
  password: UserPassword;
};

export type FindUserByEmailQuery = {
  email: UserEmail;
};

export type FindUserByUsernameQuery = {
  username: UserUsername;
};

export type FindUserByIdQuery = {
  userId: UniqueId;
};

export interface UserUseCase {
  create(command: CreateUserCommand): Promise<User>;
  findByEmail(query: FindUserByEmailQuery): Promise<User>;
  findByUsername(query: FindUserByUsernameQuery): Promise<User>;
  findById(query: FindUserByIdQuery): Promise<User>;
}



export type CreateCartCommand = {
  ownerId: UniqueId;
};

export type AddCartItemCommand = {
  cartId: UniqueId;
  productId: UniqueId;
  quantity: CartItemQuantity;
};

export type FindCartByIdQuery = {
  cartId: UniqueId;
};

export type FindCartByOwnerIdQuery = {
  ownerId: UniqueId;
};

export interface CartUseCase {
  create(command: CreateCartCommand): Promise<Cart>;
  addCartItem(command: AddCartItemCommand): Promise<Cart>;
  findById(query: FindCartByIdQuery): Promise<Cart>;
  findByOwnerId(query: FindCartByOwnerIdQuery): Promise<Cart>;
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
}



export type AuthenticationCredentials = {
  username: UserUsername;
  password: UserPassword;
}

export interface TokenUseCase {
  sign(payload: any): Promise<UserToken>;
  verify(token: UserToken): Promise<any>;
}

export interface AuthenticationhUseCase {
  authenticate(username: UserUsername, password: UserPassword): Promise<UserToken>;
}



export interface PasswordUseCase {
  hash(password: UserPassword): Promise<UserPassword>;
  compare(candidate: UserPassword, hashedPassword: UserPassword): Promise<boolean>;
}
