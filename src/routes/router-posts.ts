import {Router} from "express";
import {authJWTMiddleware, authorizationMiddleware, checkAuthUser} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";

import {commentsValidationMiddleware, postValidationMiddleware} from "../middlewares/validation-middlewares";
import {commentController, postsController} from "../composition-root";

export const postRouter = Router({})

postRouter.get('/', postsController.getAllPost.bind(postsController))

postRouter.get('/:id',
    idValidationMiddleware,
    postsController.getPostById.bind(postsController))

postRouter.get('/:id/comments',
    checkAuthUser,
    idValidationMiddleware,
    commentController.getAllCommentsByPostId.bind(commentController))

postRouter.post('/',
    authorizationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.createNewPost.bind(postsController))

postRouter.post('/:id/comments',
    authJWTMiddleware,
    idValidationMiddleware,
    commentsValidationMiddleware,
    inputValidationMiddleware,
    commentController.createNewComment.bind(commentController))

postRouter.put('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    postsController.updatePostByID.bind(postsController))

postRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    postsController.deletePostByID.bind(postsController))
