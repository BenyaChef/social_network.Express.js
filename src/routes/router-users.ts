import {Router} from "express";
import {usersController} from "../controller/users-controller";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {userValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const routerUsers = Router({})

routerUsers.get('/',
    authorizationMiddleware,
    usersController.getAllUsers)

routerUsers.post('/',
    authorizationMiddleware,
    userValidationMiddleware,
    inputValidationMiddleware,
    usersController.createUser)

routerUsers.delete('/:id',
    authorizationMiddleware,
    usersController.deleteUsersById)