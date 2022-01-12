import { addCartItem as _addCartItem } from "../../domain/cart";
import { CartItem } from "../../domain/cartItem";
import { CartGateway, CartUseCase, ProductGateway, UserGateway } from "../ports";

// TODO: Validation for commands and queries
export function createCartService(cartGateway: CartGateway, userGateway: UserGateway, productGateway: ProductGateway): CartUseCase {
  return {
    async create(command) {
      const user = await userGateway.findById(command.ownerId);
      const existingCart = await cartGateway.findByOwnerId(command.ownerId);
      if (existingCart) {
        throw new Error("Cart already exists for user");
      }
      
      const persistedCart = await cartGateway.save({
        owner: user,
        items: [],
      });

      return persistedCart;
    },

    async addCartItem(command) {
      const cart = await cartGateway.findByOwnerId(command.ownerId);
      if (!cart) {
        throw new Error("Cart does not exist for user");
      }
      
      const product = await productGateway.findById(command.productId);
      if (!product) {
        throw new Error("Product does not exist");
      }

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
      return cart;
    },

    async findByOwnerId(query) {
      const cart = cartGateway.findByOwnerId(query.ownerId);
      return cart;
    },
  };
};