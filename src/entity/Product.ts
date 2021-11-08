export interface Product {
  id?: number;
  name: string;
  price: number;
}

export function createProduct(name: string, price: number): Product {
  return {
    name,
    price,
  };
}
