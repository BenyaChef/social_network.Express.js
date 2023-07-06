import {Router} from "express";
import {authJWTMiddleware, checkAuthUser} from "../middlewares/authorization-middleware";
import {
    commentsValidationMiddleware,
    likeValidationMiddleware
} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {container} from "../composition-root";
import {CommentController} from "../controller/comment-controller";


const commentController = container.resolve(CommentController)
export const commentsRouter = Router({})

commentsRouter.get('/:id',
    checkAuthUser,
    idValidationMiddleware,
    commentController.getCommentById.bind(commentController))

commentsRouter.put('/:id',
    authJWTMiddleware,
    idValidationMiddleware,
    commentsValidationMiddleware,
    inputValidationMiddleware,
    commentController.updateCommentById.bind(commentController))

commentsRouter.put('/:id/like-status',
    authJWTMiddleware,
    likeValidationMiddleware,
    inputValidationMiddleware,
    commentController.processingLikeStatus.bind(commentController))

commentsRouter.delete('/:id',
    authJWTMiddleware,
    idValidationMiddleware,
    commentController.deleteCommentByID.bind(commentController))
