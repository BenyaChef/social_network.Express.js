import {Router} from "express";
import {loginController} from "../controller/login-controller";
import {authValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authJWTTokenMiddleware} from "../middlewares/authorization-middleware";

export const loginRouter = Router({})

loginRouter.post('/login',
    authValidationMiddleware,
    inputValidationMiddleware,
    loginController.loginUser)

loginRouter.get('/me',
    authJWTTokenMiddleware,
    loginController.getAuthUser)