export interface Product {
  name: string;
  price: number;
}

export function createProduct(name: string, price: number): Product {
  return {
    name,
    price,
  };
}
