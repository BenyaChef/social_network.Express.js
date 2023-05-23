import {Router} from "express";
import {usersController} from "../controller/users-controller";

export const usersRouter = Router({})

usersRouter.get('/', usersController.getAllUsers)
usersRouter.post('/', usersController.createUser)
usersRouter.delete('/:id',usersController.deleteUsersById)