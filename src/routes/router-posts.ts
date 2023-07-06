import {Router} from "express";
import {authJWTMiddleware, authorizationMiddleware, checkAuthUser} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";

import {
    commentsValidationMiddleware,
    likeValidationMiddleware,
    postValidationMiddleware
} from "../middlewares/validation-middlewares";
import {container} from "../composition-root";
import {PostsController} from "../controller/posts-controller";
import {CommentController} from "../controller/comment-controller";


const postsController = container.resolve(PostsController)
const commentController = container.resolve(CommentController)

export const postRouter = Router({})

postRouter.get('/',
    checkAuthUser,
    postsController.getAllPost.bind(postsController))

postRouter.get('/:id',
    checkAuthUser,
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

postRouter.put('/:id/like-status',
    authJWTMiddleware,
    likeValidationMiddleware,
    inputValidationMiddleware,
    postsController.processingLikeStatus.bind(postsController))

postRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    postsController.deletePostByID.bind(postsController))
