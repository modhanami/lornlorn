import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { User } from "../entity/user";

export interface UserGateway {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface CartGateway {
  save(userId: number, cart: Cart): Promise<void>;
  findById(id: number): Promise<Cart | null>;
  findByUserId(userId: number): Promise<Cart | null>;
  addToCart(cart: Cart, cartItem: CartItem): Promise<void>;
}