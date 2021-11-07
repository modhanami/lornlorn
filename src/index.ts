import { createCart } from "./entity/Cart";
import { createCartItem } from "./entity/CartItem";
import { createProduct } from "./entity/Product";
import { createUser } from "./entity/user";
import { createUserCart } from "./entity/UserCart";
import { sqliteUserInteractor } from "./infrastructure/SQLiteUserGateway";

const product1 = createProduct("A Book", 5.99);
const product2 = createProduct("A Mouse", 19.99);
const product3 = createProduct("A Keyboard", 35.99);
const product4 = createProduct("A Monitor", 99.99);

const cartItem1 = createCartItem(product1, 2);
const cartItem2 = createCartItem(product2, 1);
const cartItem3 = createCartItem(product3, 5);
const cartItem4 = createCartItem(product4, 7);

const cart1 = createCart();
cart1.addItems(cartItem1, cartItem2, cartItem3, cartItem4);
const user1 = createUser("John Doe", "asd", "a@b.com");
const userCart1 = createUserCart(user1, cart1);

console.dir(userCart1, { depth: null });

sqliteUserInteractor.findByUsername("abcna_eiei").then(console.log);
// sqliteUserInteractor.create(new User("abcna_eiei", "asdadasdas", "a@b.c"));
