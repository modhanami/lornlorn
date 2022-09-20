import { Cart } from "../../../domain/cart";
import { CartItem } from "../../../domain/cartItem";
import { Order, OrderItem } from "../../../domain/order";
import { Product } from "../../../domain/product";
import { User } from "../../../domain/user";

type UserResponse = {
  id: number;
  email: string;
  username: string;
};

type CartResponse = {
  owner: UserResponse;
  items: CartItemResponse[];
}

type CartItemResponse = {
  product: ProductResponse;
  quantity: number;
}

type ProductResponse = {
  id: number;
  name: string;
  price: number;
}

type OrderResponse = {
  id: number;
  user: UserResponse;
  items: OrderItemResponse[];
  status: string;
}

type OrderItemResponse = {
  product: ProductResponse;
  quantity: number;
}



export function mapUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
}



export function mapCartResponse(cart: Cart): CartResponse {
  return {
    owner: mapUserResponse(cart.owner),
    items: cart.items.map(mapCartItemResponse),
  };
}

function mapCartItemResponse(cartItem: CartItem): CartItemResponse {
  return {
    product: mapProductResponse(cartItem.product),
    quantity: cartItem.quantity,
  };
}



export function mapProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
  };
}



export function mapOrderResponse(order: Order): OrderResponse {
  return {
    id: order.id,
    user: mapUserResponse(order.user),
    items: order.items.map(mapOrderItemResponse),
    status: order.status,
  };
}

export function mapOrderItemResponse(orderItem: OrderItem): OrderItemResponse {
  return {
    product: mapProductResponse(orderItem.product),
    quantity: orderItem.quantity,
  };
}