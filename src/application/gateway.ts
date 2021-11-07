import { Cart, CartItem } from "../entity/Cart";
import { User } from "../entity/user";

export interface UserGateway {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface CartGateway {
  save(cart: Cart): Promise<void>;
  findById(id: number): Promise<Cart | null>;
}

export interface UserCartGateway {
  save(userId: number, cart: Cart): Promise<void>;
  findByUserId(userId: number): Promise<Cart | null>;
  addToCart(userId: number, cartItem: CartItem): Promise<void>;
}