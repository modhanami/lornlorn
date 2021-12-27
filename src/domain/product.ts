import { UniqueId } from "./sharedKernel";

export type Product = {
  id?: UniqueId;
  name: ProductTitle;
  price: ProductPrice;
}

export type ProductTitle = string;
// export type ProductPrice = {
//   amount: number;
//   currency: string;
// }
export type ProductPrice = number;