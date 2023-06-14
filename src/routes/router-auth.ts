import {Router} from "express";
import {loginController} from "../controller/login-controller";
import {
    authValidationMiddleware,
    codeValidationMiddleware, emailValidationMiddleware,
    userValidationMiddleware
} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authJWTMiddleware} from "../middlewares/authorization-middleware";
import {limitRequestMiddleware} from "../middlewares/limit-request";

export const loginRouter = Router({})

loginRouter.get('/me',
    authJWTMiddleware,
    loginController.getAuthUser)

loginRouter.post('/login',
    limitRequestMiddleware,
    authValidationMiddleware,
    inputValidationMiddleware,
    loginController.loginUser)

loginRouter.post('/registration',
    limitRequestMiddleware,
    userValidationMiddleware,
    inputValidationMiddleware,
    loginController.registrationNewUser)

loginRouter.post('/registration-confirmation',
    limitRequestMiddleware,
    codeValidationMiddleware,
    inputValidationMiddleware,
    loginController.confirmUser)

loginRouter.post('/registration-email-resending',
    limitRequestMiddleware,
    emailValidationMiddleware,
    inputValidationMiddleware,
    loginController.emailResending)

loginRouter.post('/refresh-token',
    loginController.generatedNewTokens)

loginRouter.post('/logout',
    loginController.logoutUser)
