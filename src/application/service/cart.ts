import { CartGateway, CartUseCase, ProductGateway, UserGateway } from "../ports";
import { addCartItem as _addCartItem } from "../../domain/cart";
import { CartItem } from "../../domain/cartItem";

// TODO: Validation for commands and queries
export function createCartService(cartGateway: CartGateway, userGateway: UserGateway, productGateway: ProductGateway): CartUseCase {
  return {
    async create(command) {
      const user = await userGateway.findById(command.ownerId);
      const cart = await cartGateway.save({
        owner: user,
        items: [],
      });
      return cart;
    },

    async addCartItem(command) {
      const cart = await cartGateway.findById(command.cartId);
      const product = await productGateway.findById(command.productId);
      const cartItem: CartItem = {
        product,
        quantity: command.quantity,
      };

      const updatedCart = _addCartItem(cart, cartItem);
      const persistedCart = await cartGateway.save(updatedCart);

      return persistedCart;
    },

    async findById(query) {
      const cart = cartGateway.findById(query.cartId);
      return cart || null;
    },

    async findByOwnerId(query) {
      const cart = cartGateway.findByOwnerId(query.ownerId);
      return cart || null;
    },
  };
};