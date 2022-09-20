import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { createAuthenticationService } from "../../../application/service/authentication";
import { createCartService } from "../../../application/service/cart";
import { createOrderService } from "../../../application/service/order";
import { createPasswordService } from "../../../application/service/password";
import { createProductService } from "../../../application/service/product";
import { createTokenService } from "../../../application/service/token";
import { createUserService } from "../../../application/service/user";
import { createCartAdapter } from "../../../infrastructure/prisma/cart";
import { createOrderAdapter } from "../../../infrastructure/prisma/order";
import { createProductAdapter } from "../../../infrastructure/prisma/product";
import { createRefreshTokenAdapter } from "../../../infrastructure/prisma/refreshToken";
import { createUserAdapter } from "../../../infrastructure/prisma/user";
import { createCartController } from "../controller/cart";
import { createCheckoutController } from "../controller/checkout";
import { createProductController } from "../controller/product";
import { createTokenController } from "../controller/token";
import { createUserController } from "../controller/user";
import { createAuthMiddlewares } from "../middleware";
import errorHandler from "../middleware/defaultErrorHandler";

const prisma = new PrismaClient();
const userGateway = createUserAdapter(prisma);
const productGateway = createProductAdapter(prisma);
const cartGateway = createCartAdapter(prisma);
const orderGateway = createOrderAdapter(prisma);
const refreshTokenAdapter = createRefreshTokenAdapter(prisma);

const passwordService = createPasswordService();
const tokenService = createTokenService(refreshTokenAdapter);
const userService = createUserService(userGateway);
const productService = createProductService(productGateway);
const cartService = createCartService(cartGateway, userGateway, productGateway);
const orderService = createOrderService(orderGateway);
const authenticationService = createAuthenticationService(userGateway, passwordService, tokenService);

const userControler = createUserController(userService, authenticationService, passwordService);
const productController = createProductController(productService);
const cartController = createCartController(cartService);
const tokenController = createTokenController(tokenService, userService);
const checkoutController = createCheckoutController(orderService, cartService);

const router = Router();
const userRouter = Router();
const productRouter = Router();
const cartRouter = Router();
const orderRouter = Router();
const tokenRouter = Router();

const authMiddlewares = createAuthMiddlewares(tokenService);

router.use("/users", userRouter);
userRouter.post("/", userControler.signup);
userRouter.post("/login", userControler.login);

router.use("/token", tokenRouter);
tokenRouter.post("/refresh", tokenController.refresh);

router.use("/products", productRouter);
productRouter.get("/", productController.findAll);
productRouter.get("/:id", productController.findById);

router.use("/carts", cartRouter);
cartRouter.post("/me/add-item", authMiddlewares.verifyToken, cartController.addOwnCartItem);
cartRouter.get("/me", authMiddlewares.verifyToken, cartController.findOwnCart);

router.use("/checkout", authMiddlewares.verifyToken, checkoutController.checkout);

router.use(errorHandler);

export default router;