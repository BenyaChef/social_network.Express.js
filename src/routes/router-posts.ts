import {Router} from "express";
import {authJWTMiddleware, authorizationMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {postsController} from "../controller/posts-controller";
import {commentsValidationMiddleware, postValidationMiddleware} from "../middlewares/validation-middlewares";
import {commentController} from "../controller/comment-conroller";

export const postRouter = Router({})

postRouter.get('/', postsController.getAllPost)

postRouter.get('/:id',
    idValidationMiddleware,
    postsController.getPostById)

postRouter.get('/:id/comments',
    idValidationMiddleware,
    commentController.getAllCommentsByPostId)

postRouter.post('/',
    authorizationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.createNewPost)

postRouter.post('/:id/comments',
    authJWTMiddleware,
    idValidationMiddleware,
    commentsValidationMiddleware,
    inputValidationMiddleware,
    commentController.createNewComment)

postRouter.put('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.updatePostByID)

postRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    postsController.deletePostByID)
