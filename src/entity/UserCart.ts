import { Cart, CartItem } from "./Cart";
import { Product } from "./Product";
import { User } from "./user";

export class UserCart {
  private user: User;
  private cart: Cart;

  constructor(user: User, cart: Cart) {
    this.user = user;
    this.cart = cart;
  }

  public getUser(): User {
    return this.user;
  }

  public getCart(): Cart {
    return this.cart;
  }

  public addToCart(product: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const cartItem = this.cart
      .getItems()
      .find((item) => item.getProduct().getName() === product.getName());

    if (cartItem) {
      cartItem.setQuantity(cartItem.getQuantity() + quantity);
    } else {
      this.cart.addItem(new CartItem(product, quantity));
    }
  }
}
