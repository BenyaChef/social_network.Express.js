import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {postValidationMiddleware} from "../middlewares/post-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {idInputMiddleware} from "../middlewares/id-input-middleware";
import {postsController} from "../controller/posts-controller";

export const postRouter = Router({})

postRouter.get('/', postsController.getAllPost)

postRouter.get('/:id',
    idValidationMiddleware,
    idInputMiddleware,
    postsController.getPostById)

postRouter.post('/',
    authorizationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.createNewPost)

postRouter.put('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.updatePostByID)

postRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    postsController.deletePostByID)
