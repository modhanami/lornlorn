import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { User } from "../entity/user";
import { CartGateway, UserGateway } from "./gateway";

export function createUserInteractor(userGateway: UserGateway) {
  return {
    async create(user: User): Promise<boolean> {
      const existingUser = await userGateway.findByUsername(user.username);
      if (existingUser) {
        throw new Error("User already exists");
      }
      await userGateway.save(user);
      return true;
    },
    async update(user: User): Promise<boolean> {
      const existingUser = await userGateway.findByUsername(user.username);
      if (!existingUser) {
        throw new Error("User does not exist");
      }
      await userGateway.save(user);
      return true;
    },
    async findByEmail(email: string): Promise<User | null> {
      return userGateway.findByEmail(email);
    },
    async findById(id: number): Promise<User | null> {
      return userGateway.findById(id);
    },
    async findByUsername(username: string): Promise<User | null> {
      return userGateway.findByUsername(username);
    },
  };
}

export function createCartInteractor(cartGateway: CartGateway) {
  return {
    async create(userId: number, cart: Cart): Promise<void> {
      await cartGateway.save(userId, cart);
    },
    async findById(id: number): Promise<Cart | null> {
      return cartGateway.findById(id);
    },
    async findByUserId(userId: number): Promise<Cart | null> {
      return cartGateway.findByUserId(userId);
    },
    async addToCart(userId: number, cartItem: CartItem): Promise<void> {
      const cart = await cartGateway.findByUserId(userId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      cartGateway.addToCart(cart, cartItem);
    },
  };
}
