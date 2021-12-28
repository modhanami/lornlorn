import {addCartItem, Cart, getCartTotal} from "./cart"

function createCartWithTwoExistingItems() {
  const existingCart: Cart = {
    id: 1,
    owner: {
      id: 1,
      username: "Spitus Factus",
      email: "abc@def.com",
      password: ""
    },
    items: [
      {
        product: {
          id: 1,
          name: "Item 1",
          price: 10,
        },
        quantity: 10
      },
      {
        product: {
          id: 2,
          name: "Item 2",
          price: 20,
        },
        quantity: 20
      }
    ]
  }

  return existingCart;
}

describe('addCartItem', () => {
  it('should add a new product', () => {
    const cart = createCartWithTwoExistingItems();
    const newItem = {
      product: {
        id: 3,
        name: "Item 3",
        price: 30,
      },
      quantity: 30
    };

    const result = addCartItem(cart, newItem);
    expect(result.items.length).toBe(cart.items.length + 1);
    expect(result.items[result.items.length - 1]).toEqual(newItem);
  });

  it('should update the quantity of an existing product', () => {
    const cart = createCartWithTwoExistingItems();
    const existingItem = cart.items[0];
    const oldQuantity = existingItem.quantity;
    const newQuantity = 10;

    const result = addCartItem(cart, {
      product: existingItem.product,
      quantity: newQuantity
    });

    expect(result.items.length).toBe(cart.items.length);
    expect(result.items[0].quantity).toBe(oldQuantity + newQuantity);
  });
});

describe('getCartTotal', () => {
  it('should return the total of all products in the cart', () => {
    const cart = createCartWithTwoExistingItems();
    const result = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    expect(getCartTotal(cart)).toBe(result);
  });
})