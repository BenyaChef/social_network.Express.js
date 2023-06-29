import {Request, Response} from "express";
import {CommentsService} from "../domain/comments-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {ObjectId} from "mongodb";
import {
    CommentsQueryRepository,
} from "../repositories/query-repositories/comments-query-repository";
import {RequestWithParams, RequestWithParamsAndQuery} from "../models/request-models/request-types";
import {CommentPaginationModel} from "../models/request-models/comment-pagination-model";
import {Errors} from "../enum/errors";
import {resultCodeHandler} from "../utils/result-code-handler";
import {CommentViewModel} from "../models/comment-models/comment-view-model";

export class CommentController {
    constructor(protected commentsQueryRepository: CommentsQueryRepository,
                protected commentsService: CommentsService) {
    }
    async getCommentById(req: RequestWithParams<{ id: string }>, res: Response) {
        const commentId = new ObjectId(req.params.id)
        const findComment: CommentViewModel | null = await this.commentsQueryRepository.findCommentById(commentId)
        if(!findComment) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(findComment)
    }

    async getAllCommentsByPostId(req: RequestWithParamsAndQuery<{ id: string }, CommentPaginationModel>,
                                 res: Response) {
        const findComments: CommentPaginationModel | null = await this.commentsQueryRepository.findAllCommentByPostId(req.query, req.params.id)
        if (!findComments) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(findComments)
    }

    async createNewComment(req: Request, res: Response) {
        const newCommentId: ObjectId | null = await this.commentsService.createNewComment(req.body, req.userId!, req.params.id)
        if (!newCommentId) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        const newComment = await this.commentsQueryRepository.findCommentById(newCommentId)
        if (!newComment) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newComment)
    }

    async updateCommentById(req: Request, res: Response) {
        const resultUpdate = await this.commentsService.updateComments(req.body, req.userId!, req.params.id)
        if (resultUpdate.success) {
            return res.sendStatus(HTTP_STATUS.No_content)
        }
        if (resultUpdate.error === Errors.Not_Found) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        if (resultUpdate.error === Errors.Forbidden) {
            return res.sendStatus(HTTP_STATUS.Forbidden)
        }
        return res.sendStatus(HTTP_STATUS.Server_error)
    }

    async deleteCommentByID(req: Request, res: Response) {
        const resultDelete = await this.commentsService.deleteComment(req.params.id, req.userId!)
        if (!resultDelete.success) {
            return res.sendStatus(resultCodeHandler(resultDelete))
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}
