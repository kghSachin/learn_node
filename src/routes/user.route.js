import express from "express";
import { AuthController } from "../controller/user.controller.js";

const userRoute = express.Router();

userRoute.post("/create_user", AuthController.register);
userRoute.post("/login", AuthController.login);

export default userRoute;
