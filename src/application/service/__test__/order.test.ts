import { Order } from "../../../domain/order";
import { OrderGateway, OrderUseCase } from "../../ports";
import { createOrderService } from "../order";
import { cart1Persisted, cart1PersistedWithOneItem, user1Persisted } from "./shared";
import { Mocked } from "./shared/types";

describe('Order service', () => {
  let orderGateway: Mocked<OrderGateway>;
  let orderService: OrderUseCase;

  const order1PersistedWithOneItemPending: Order = {
    id: 1,
    user: user1Persisted,
    items: [
      {
        product: {
          id: 1,
          name: 'Product 1',
          price: 10,
        },
        quantity: 1,
      },
    ],
    status: 'pending',
  };

  beforeEach(() => {
    orderGateway = {
      save: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
    };

    orderService = createOrderService(orderGateway);
  });


  describe('create', () => {
    it('should create an order', async () => {
      orderGateway.save.mockResolvedValue(order1PersistedWithOneItemPending);

      // order items can be extracted from the cart
      const createdOrder = await orderService.create(cart1PersistedWithOneItem);

      expect(createdOrder).toEqual(order1PersistedWithOneItemPending);
    });

    it('should throw an error if cart is empty', async () => {
      await expect(orderService.create(cart1Persisted)).rejects.toThrow('Cart is empty');
    });
  });

  describe('findById', () => {
    it('should find an order by id', async () => {
      orderGateway.findById.mockResolvedValue(order1PersistedWithOneItemPending);

      const order = await orderService.findById(1);

      expect(order).toEqual(order1PersistedWithOneItemPending);
    });

    it('should return null if order does not exist', async () => {
      orderGateway.findById.mockResolvedValue(null);

      const order = await orderService.findById(1);

      expect(order).toEqual(null);
    });
  });

  describe('findByOwnerId', () => {
    it('should return an array of orders for a user', async () => {
      orderGateway.findByOwnerId.mockResolvedValue([order1PersistedWithOneItemPending]);

      const order = await orderService.findByOwnerId(1);

      expect(order).toEqual([order1PersistedWithOneItemPending]);
    });

    it('should return null if user does not have any orders', async () => {
      orderGateway.findByOwnerId.mockResolvedValue(null);

      const order = await orderService.findByOwnerId(1);

      expect(order).toEqual(null);
    });
  });
});