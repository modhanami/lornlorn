import { Cart } from "../../../../domain/cart";
import { Product } from "../../../../domain/product";
import { User } from "../../../../domain/user";
import { MaybeNew } from "../../../ports";

export const user1: MaybeNew<User> = {
  email: 'abc@def.com',
  username: 'abc',
  password: '123',
};

export const user1Persisted: User = {
  ...user1,
  id: 1,
};

export const product1Persisted: Product = {
  id: 1,
  name: 'Product 1',
  price: 10
};


export const cart1Persisted: Cart = {
  id: 1,
  owner: user1Persisted,
  items: []
};

export const cart1PersistedWithOneItem: Cart = {
  ...cart1Persisted,
  items: [
    {
      product: product1Persisted,
      quantity: 1
    }
  ]
};