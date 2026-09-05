import { Router } from "express";
import * as authcontroller from "../controllers/auth.controller.js";
import { authLimiter, otpLimiter } from "../middleware/rateLimiter.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, authcontroller.registerUser);

authRouter.post("/login", authLimiter, authcontroller.login);

authRouter.get("/get-me", authcontroller.getMe);

authRouter.get("/refresh-token", authLimiter, authcontroller.refreshToken);

authRouter.get("/logout", authcontroller.logout);

authRouter.get("/logout-all", authcontroller.logoutall);

authRouter.post("/verify-email", otpLimiter, authcontroller.verifyEmail);

export default authRouter;