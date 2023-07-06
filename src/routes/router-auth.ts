import {Router} from "express";
import {
    authValidationMiddleware,
    codeValidationMiddleware, emailValidationMiddleware, newPasswordValidationMiddleware,
    userValidationMiddleware
} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authJWTMiddleware} from "../middlewares/authorization-middleware";
import {limitRequestMiddleware} from "../middlewares/limit-request";
import {container} from "../composition-root";
import {AuthController} from "../controller/auth-controller";

const authController = container.resolve(AuthController)
export const authRouter = Router({})

authRouter.get('/me',
    authJWTMiddleware,
    authController.getAuthUser.bind(authController))

authRouter.post('/login',
    limitRequestMiddleware,
    authValidationMiddleware,
    inputValidationMiddleware,
    authController.loginUser.bind(authController))

authRouter.post('/registration',
    limitRequestMiddleware,
    userValidationMiddleware,
    inputValidationMiddleware,
    authController.registrationNewUser.bind(authController))

authRouter.post('/registration-confirmation',
    limitRequestMiddleware,
    codeValidationMiddleware,
    inputValidationMiddleware,
    authController.confirmUser.bind(authController))

authRouter.post('/registration-email-resending',
    limitRequestMiddleware,
    emailValidationMiddleware,
    inputValidationMiddleware,
    authController.emailResending.bind(authController))

authRouter.post('/refresh-token',
    authController.generatedNewTokens.bind(authController))

authRouter.post('/logout',
    authController.logoutUser.bind(authController))

authRouter.post('/password-recovery',
    limitRequestMiddleware,
    emailValidationMiddleware,
    inputValidationMiddleware,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    limitRequestMiddleware,
    newPasswordValidationMiddleware,
    inputValidationMiddleware,
    authController.setNewPassword.bind(authController))
