import { Cart, CartItem } from "./entity/Cart";
import { Product } from "./entity/Product";
import { User } from "./entity/user";
import { UserCart } from "./entity/UserCart";
import { sqliteUserInteractor } from "./infrastructure/SQLiteUserGateway";

const product1 = new Product('A Book', 5.99);
const product2 = new Product('A Mouse', 19.99);
const product3 = new Product('A Keyboard', 35.99);
const product4 = new Product('A Monitor', 99.99);

const cartItem1 = new CartItem(product1, 2);
const cartItem2 = new CartItem(product2, 1);
const cartItem3 = new CartItem(product3, 5);
const cartItem4 = new CartItem(product4, 7);

const cart1 = new Cart([cartItem1, cartItem2, cartItem3, cartItem4]);
const user1 = new User('John Doe', 'asd', 'a@b.com');
const userCart1 = new UserCart(user1, cart1);

// console.dir(userCart1, { depth: null });

console.log("A")
sqliteUserInteractor.findByUsername("abcna_eiei").then(console.log)
// sqliteUserInteractor.create(new User("abcna_eiei", "asdadasdas", "a@b.c"));