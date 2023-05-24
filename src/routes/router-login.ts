import {Router} from "express";
import {loginController} from "../controller/login-controller";
import {authValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const loginRouter = Router({})

loginRouter.post('/login',
    authValidationMiddleware,
    inputValidationMiddleware,
    loginController.loginUser)