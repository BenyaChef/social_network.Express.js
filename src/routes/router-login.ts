import {Router} from "express";
import {loginController} from "../controller/login-controller";
import {authValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authJWTMiddleware} from "../middlewares/authorization-middleware";

export const loginRouter = Router({})

loginRouter.post('/login',
    authValidationMiddleware,
    inputValidationMiddleware,
    loginController.loginUser)

loginRouter.get('/me',
    authJWTMiddleware,
    loginController.getAuthUser)