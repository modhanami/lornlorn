import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { createAuthenticationService } from "../../../application/service/auth";
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
import { createAuthController } from "../controller/auth";
import { createCartController } from "../controller/cart";
import { createCheckoutController } from "../controller/checkout";
import { createProductController } from "../controller/product";
import { createAuthMiddlewares } from "../middleware";
import errorHandler from "../middleware/defaultErrorHandler";

const prisma = new PrismaClient();
const userGateway = createUserAdapter(prisma);
const productGateway = createProductAdapter(prisma);
const cartGateway = createCartAdapter(prisma);
const orderGateway = createOrderAdapter(prisma);
const refreshTokenAdapter = createRefreshTokenAdapter(prisma);


const tokenService = createTokenService(refreshTokenAdapter, {
  accessTokenSecret: mustGetEnv("ACCESS_TOKEN_SECRET"),
  accessTokenExpiresIn: mustGetEnv("ACCESS_TOKEN_EXPIRES_IN"),
  refreshTokenLength: Number(mustGetEnv("REFRESH_TOKEN_LENGTH")),
  refreshTokenMaxAgeSeconds: Number(mustGetEnv("REFRESH_TOKEN_MAX_AGE_SECONDS")),
});
const passwordService = createPasswordService();
const userService = createUserService(userGateway);
const productService = createProductService(productGateway);
const cartService = createCartService(cartGateway, userGateway, productGateway);
const orderService = createOrderService(orderGateway);
const authenticationService = createAuthenticationService(userService, passwordService);

const productController = createProductController(productService);
const cartController = createCartController(cartService);
const checkoutController = createCheckoutController(orderService, cartService);

const router = Router();
const productRouter = Router();
const cartRouter = Router();
const orderRouter = Router();
const authRouter = Router();

const authMiddlewares = createAuthMiddlewares(tokenService);

router.use("/auth", authRouter);
const authController = createAuthController(authenticationService, tokenService, userService, {
  disableSecureCookies: Boolean(mustGetEnv("DISABLE_SECURE_COOKIES")),
});
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/refresh", authController.refreshToken);
authRouter.get("/userinfo", authMiddlewares.verifyToken, authController.getUserinfo);

router.use("/products", productRouter);
productRouter.get("/", productController.findAll);
productRouter.get("/:id", productController.findById);

router.use("/carts", cartRouter);
cartRouter.post("/me/add-item", authMiddlewares.verifyToken, cartController.addOwnCartItem);
cartRouter.get("/me", authMiddlewares.verifyToken, cartController.findOwnCart);

router.use("/checkout", authMiddlewares.verifyToken, checkoutController.checkout);

router.use(errorHandler);

export default router;

function mustGetEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not defined`);
  }
  return value;
}
