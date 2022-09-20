import { addCartItem as _addCartItem } from "../../domain/cart";
import { CartItem } from "../../domain/cartItem";
import { CartGateway, CartUseCase, ProductGateway, UserGateway } from "../ports";

// TODO: Validation for commands and queries
export function createCartService(cartGateway: CartGateway, userGateway: UserGateway, productGateway: ProductGateway): CartUseCase {
  return {
    async create(ownerId) {
      const user = await userGateway.findById(ownerId);
      const existingCart = await cartGateway.findByOwnerId(ownerId);
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
      console.log(persistedCart);

      return persistedCart;
    },

    async findById(id) {
      const cart = cartGateway.findById(id);
      return cart;
    },

    async findByOwnerId(ownerId) {
      const cart = cartGateway.findByOwnerId(ownerId);
      return cart;
    },

    async clearCart(ownerId) {
      const cart = await cartGateway.findByOwnerId(ownerId);
      if (!cart) {
        throw new Error("Cart does not exist for user");
      }

      cart.items = [];
      const persistedCart = await cartGateway.save(cart);
      return persistedCart;
    }
  };
};