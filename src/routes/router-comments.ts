import {Router} from "express";
import {authJWTMiddleware} from "../middlewares/authorization-middleware";
import {commentsValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {commentController} from "../composition-root";

export const commentsRouter = Router({})

commentsRouter.get('/:id',
    idValidationMiddleware,
    commentController.getCommentById.bind(commentController))

commentsRouter.put('/:id',
    authJWTMiddleware,
    idValidationMiddleware,
    commentsValidationMiddleware,
    inputValidationMiddleware,
    commentController.updateCommentById.bind(commentController))

commentsRouter.delete('/:id',
    authJWTMiddleware,
    idValidationMiddleware,
    commentController.deleteCommentByID.bind(commentController))
