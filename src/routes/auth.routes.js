import {Router} from "express";
import * as authcontroller from "../controllers/auth.controller.js"

const authRouter = Router();



authRouter.post("/register",authcontroller.registerUser);
authRouter.get("/get-me", authcontroller.getMe);
authRouter.get("/refresh-token", authcontroller.refreshToken);
authRouter.post("/logout", authcontroller.logout);


export default authRouter;


