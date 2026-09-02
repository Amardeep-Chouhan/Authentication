import {Router} from "express";
import * as authcontroller from "../controllers/auth.controller.js"

const authRouter = Router();



authRouter.post("/register",authcontroller.registerUser);
authRouter.post("/login", authcontroller.login);
authRouter.get("/get-me", authcontroller.getMe);
authRouter.get("/refresh-token", authcontroller.refreshToken);
authRouter.get("/logout", authcontroller.logout);
authRouter.get("/logout-all", authcontroller.logoutall);


export default authRouter;


