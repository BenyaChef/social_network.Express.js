import {Router} from "express";
import {authController} from "../controller/auth-controller";
import {
    authValidationMiddleware,
    codeValidationMiddleware, emailValidationMiddleware, newPasswordValidationMiddleware,
    userValidationMiddleware
} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authJWTMiddleware} from "../middlewares/authorization-middleware";
import {limitRequestMiddleware} from "../middlewares/limit-request";

export const authRouter = Router({})

authRouter.get('/me',
    authJWTMiddleware,
    authController.getAuthUser)

authRouter.post('/login',
    limitRequestMiddleware,
    authValidationMiddleware,
    inputValidationMiddleware,
    authController.loginUser)

authRouter.post('/registration',
    limitRequestMiddleware,
    userValidationMiddleware,
    inputValidationMiddleware,
    authController.registrationNewUser)

authRouter.post('/registration-confirmation',
    limitRequestMiddleware,
    codeValidationMiddleware,
    inputValidationMiddleware,
    authController.confirmUser)

authRouter.post('/registration-email-resending',
    limitRequestMiddleware,
    emailValidationMiddleware,
    inputValidationMiddleware,
    authController.emailResending)

authRouter.post('/refresh-token',
    authController.generatedNewTokens)

authRouter.post('/logout',
    authController.logoutUser)

authRouter.post('/password-recovery',
    limitRequestMiddleware,
    emailValidationMiddleware,
    inputValidationMiddleware,
    authController.passwordRecovery)

authRouter.post('/new-password',
    limitRequestMiddleware,
    newPasswordValidationMiddleware,
    inputValidationMiddleware,
    authController.setNewPassword)
