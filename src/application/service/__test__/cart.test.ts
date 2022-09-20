import { CartGateway, CartUseCase, UserGateway, ProductGateway } from "../../ports";
import { createCartService } from "../cart";
import { cart1Persisted, cart1PersistedWithOneItem, product1Persisted, user1Persisted } from "./shared";
import { Mocked } from "./shared/types";

describe('Cart service', () => {
  let cartGateway: Mocked<CartGateway>;
  let cartService: CartUseCase;
  let userGateway: Mocked<UserGateway>;
  let productGateway: Mocked<ProductGateway>;

  beforeEach(() => {
    cartGateway = {
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      save: jest.fn(),
    };

    userGateway = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
    };

    productGateway = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    cartService = createCartService(cartGateway, userGateway, productGateway);
  });

  describe('create', () => {
    it('should create a cart', async () => {
      userGateway.findById.mockResolvedValue(user1Persisted);
      cartGateway.findByOwnerId.mockResolvedValue(null);
      cartGateway.save.mockResolvedValue(cart1Persisted);

      const createdCart = await cartService.create(user1Persisted.id);

      expect(createdCart).toEqual(cart1Persisted);
    });

    it('should throw an error if cart already exists', async () => {
      userGateway.findById.mockResolvedValue(user1Persisted);
      cartGateway.findByOwnerId.mockResolvedValueOnce(cart1Persisted);

      await expect(cartService.create(user1Persisted.id)).rejects.toThrow('Cart already exists for user');
    });
  });


  describe('addCartItem', () => {
    it('should add a newly created cart item to a cart', async () => {
      const expectedCart1PersistedWithOneItem = {
        ...cart1Persisted,
        items: [
          {
            product: product1Persisted,
            quantity: 11
          }
        ]
      };

      cartGateway.findByOwnerId.mockResolvedValue(cart1Persisted);
      productGateway.findById.mockResolvedValue(product1Persisted);
      cartGateway.save.mockResolvedValue(expectedCart1PersistedWithOneItem);

      const updatedCart = await cartService.addCartItem({
        ownerId: user1Persisted.id,
        productId: 1,
        quantity: 11,
      });

      expect(updatedCart.items.length).toEqual(1);
      expect(updatedCart.items[0].quantity).toEqual(11);
    });

    it('should increment the quantity of an existing cart item', async () => {
      const expectedCart1 = {
        ...cart1PersistedWithOneItem,
        items: [
          {
            product: product1Persisted,
            quantity: 27

          }
        ]
      };
      cartGateway.findByOwnerId.mockResolvedValue(cart1PersistedWithOneItem);
      productGateway.findById.mockResolvedValue(product1Persisted);
      cartGateway.save.mockResolvedValue(expectedCart1);

      const updatedCart = await cartService.addCartItem({
        ownerId: user1Persisted.id,
        productId: product1Persisted.id,
        quantity: 26,
      });

      expect(updatedCart.items.length).toEqual(1);
      expect(updatedCart.items[0].quantity).toEqual(27);
    });

    it('should throw an error if cart does not exist', async () => {
      cartGateway.findByOwnerId.mockResolvedValue(null);
      productGateway.findById.mockResolvedValue(null);

      await expect(cartService.addCartItem({
        ownerId: user1Persisted.id,
        productId: 1,
        quantity: 1,
      })).rejects.toThrow('Cart does not exist for user');
    });

    it('should throw an error if product does not exist', async () => {
      cartGateway.findByOwnerId.mockResolvedValue(cart1Persisted);
      productGateway.findById.mockResolvedValue(null);


      await expect(cartService.addCartItem({
        ownerId: user1Persisted.id,
        productId: 10,
        quantity: 5,
      })).rejects.toThrow('Product does not exist');
    });
  });


  describe('clearCart', () => {
    it('should clear a cart', async () => {
      cartGateway.findByOwnerId.mockResolvedValue(cart1PersistedWithOneItem);
      cartGateway.save.mockResolvedValue(cart1Persisted);

      const updatedCart = await cartService.clearCart(user1Persisted.id);

      expect(updatedCart.items.length).toEqual(0);
    });

    it('should throw an error if cart does not exist', async () => {
      cartGateway.findByOwnerId.mockResolvedValue(null);

      await expect(cartService.clearCart(user1Persisted.id)).rejects.toThrow('Cart does not exist for user');
    });
  });


  describe('findById', () => {
    it('should find a cart by id', async () => {
      cartGateway.findById.mockResolvedValue(cart1Persisted);

      const cart = await cartService.findById(1);

      expect(cart).toEqual(cart1Persisted);
    });

    it('should return null if cart does not exist', async () => {
      cartGateway.findById.mockResolvedValue(null);

      const cart = await cartService.findById(1);

      expect(cart).toEqual(null);
    });
  });

  describe('findByOwnerId', () => {
    it('should find a cart by owner id', async () => {
      cartGateway.findByOwnerId.mockResolvedValue(cart1Persisted);

      const cart = await cartService.findByOwnerId(1);

      expect(cart).toEqual(cart1Persisted);
    });

    it('should return null if cart does not exist', async () => {
      cartGateway.findByOwnerId.mockResolvedValue(null);

      const cart = await cartService.findByOwnerId(1);

      expect(cart).toEqual(null);
    });
  });
});