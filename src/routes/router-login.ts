import {Router} from "express";
import {loginController} from "../controller/login-controller";

export const loginRouter = Router({})

loginRouter.post('/login', loginController.loginUser)