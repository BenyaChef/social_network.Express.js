import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {userAdminValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {container} from "../composition-root";
import {UsersController} from "../controller/users-controller";

const usersController = container.resolve(UsersController)
export const usersRouter = Router({})

usersRouter.get('/',
    authorizationMiddleware,
    usersController.getAllUsers.bind(usersController))

usersRouter.post('/',
    authorizationMiddleware,
    userAdminValidationMiddleware,
    inputValidationMiddleware,
    usersController.createAdminUser.bind(usersController))

usersRouter.delete('/:id',
    authorizationMiddleware,
    usersController.deleteUsersById.bind(usersController))
