import {Request, Response} from "express";
import {commentsService} from "../domain/comments-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {ObjectId} from "mongodb";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {RequestWithParamsAndQuery} from "../models/request-models/request-types";
import {CommentPaginationModel} from "../models/request-models/comment-pagination-model";
import {Errors} from "../enum/errors";

export const commentController = {

    async getAllCommentsByPostId(req: RequestWithParamsAndQuery<{ id: string }, CommentPaginationModel>,
                                 res: Response) {
        const findComments: CommentPaginationModel | null = await commentsQueryRepository.findAllCommentByPostId(req.query, req.params.id)
        if (!findComments) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(findComments)
    },

    async createNewComment(req: Request, res: Response) {
        const newCommentId: ObjectId | null = await commentsService.createNewComment(req.body, req.userId!, req.params.id)
        if (!newCommentId) {
            console.log(newCommentId)
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        const newComment = await commentsQueryRepository.findCommentById(newCommentId)
        if (!newComment) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newComment)
    },

    async updateCommentById(req: Request, res: Response) {
        const resultUpdate = await commentsService.updateComments(req.body, req.userId!, req.params.id)
        if(resultUpdate.success) {
            return res.sendStatus(HTTP_STATUS.No_content)
        }
        if(resultUpdate.error === Errors.Not_Found) {
           return  res.sendStatus(HTTP_STATUS.Not_found)
        }
        if(resultUpdate.error === Errors.Forbidden) {
           return  res.sendStatus(HTTP_STATUS.Forbidden)
        }
        return res.sendStatus(HTTP_STATUS.Server_error)
    }
}