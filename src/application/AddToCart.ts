import { Cart, CartItem } from "../entity/Cart";
import { User } from "../entity/user";
import { CartGateway, UserCartGateway, UserGateway } from "./gateway";

export function createUserInteractor(userGateway: UserGateway) {
  return {
    async create(user: User): Promise<boolean> {
      const existingUser = await userGateway.findByEmail(user.getEmail());
      if (existingUser) {
        throw new Error("User already exists");
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
    async save(cart: Cart): Promise<void> {
      await cartGateway.save(cart);
    },
    async findById(id: number): Promise<Cart | null> {
      return cartGateway.findById(id);
    },
  };
}

export function createUserCartInteractor(userCartGateway: UserCartGateway) {
  return {
    async save(userId: number, cart: Cart): Promise<void> {
      await userCartGateway.save(userId, cart);
    },
    async findByUserId(userId: number): Promise<Cart | null> {
      return userCartGateway.findByUserId(userId);
    },
    async addToCart(userId: number, cartItem: CartItem): Promise<void> {
      const cart = await userCartGateway.findByUserId(userId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      cart.addItem(cartItem);
      await userCartGateway.save(userId, cart);
    }
  };
}