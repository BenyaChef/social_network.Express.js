import {Router} from "express";
import {usersController} from "../controller/users-controller";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {userValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const usersRouter = Router({})

usersRouter.get('/',
    authorizationMiddleware,
    usersController.getAllUsers)

usersRouter.post('/',
    authorizationMiddleware,
    userValidationMiddleware,
    inputValidationMiddleware,
    usersController.createUser)

usersRouter.delete('/:id',
    authorizationMiddleware,
    usersController.deleteUsersById)