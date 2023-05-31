import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {postsController} from "../controller/posts-controller";
import {postValidationMiddleware} from "../middlewares/validation-middlewares";

export const postRouter = Router({})

postRouter.get('/', postsController.getAllPost)

postRouter.get('/:id',
    idValidationMiddleware,
    postsController.getPostById)

postRouter.post('/',
    authorizationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.createNewPost)

postRouter.put('/:id',
    authorizationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.updatePostByID)

postRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    postsController.deletePostByID)
