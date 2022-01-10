import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { createAuthenticationService } from "../../../application/service/authentication";
import { createCartService } from "../../../application/service/cart";
import { createPasswordService } from "../../../application/service/password";
import { createProductService } from "../../../application/service/product";
import { createTokenService } from "../../../application/service/token";
import { createUserService } from "../../../application/service/user";
import { createCartAdapter } from "../../../infrastructure/prisma/cart";
import { createProductAdapter } from "../../../infrastructure/prisma/product";
import { createRefreshTokenAdapter } from "../../../infrastructure/prisma/refreshToken";
import { createUserAdapter } from "../../../infrastructure/prisma/user";
import { createCartController } from "../controller/cart";
import { createProductController } from "../controller/product";
import { createTokenController } from "../controller/token";
import { createUserController } from "../controller/user";
import { createAuthMiddlewares } from "../middleware";
import errorHandler from "../middleware/defaultErrorHandler";

const prisma = new PrismaClient();
const userGateway = createUserAdapter(prisma);
const productGateway = createProductAdapter(prisma);
const cartGateway = createCartAdapter(prisma);
const refreshTokenAdapter = createRefreshTokenAdapter(prisma);

const passwordService = createPasswordService();
const tokenService = createTokenService(refreshTokenAdapter);
const userService = createUserService(userGateway);
const productService = createProductService(productGateway);
const cartService = createCartService(cartGateway, userGateway, productGateway);
const authenticationService = createAuthenticationService(userGateway, passwordService, tokenService);

const userControler = createUserController(userService, authenticationService, passwordService);
const productController = createProductController(productService);
const cartController = createCartController(cartService);
const tokenController = createTokenController(tokenService, userService);

const router = Router();
const userRouter = Router();
const productRouter = Router();
const cartRouter = Router();
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

router.use(errorHandler);

export default router;