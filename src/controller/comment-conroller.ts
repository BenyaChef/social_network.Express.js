import {Request, Response} from "express";
import {commentsService} from "../domain/comments-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {ObjectId} from "mongodb";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";

export const commentController = {

    async getAllCommentsByPostId(req: Request, res:Response) {
        const findComments = await commentsQueryRepository.findAllCommentByPostId(req.query, req.params.id)
    },

    async createNewComment(req: Request, res: Response) {
        const newCommentId: ObjectId | null = await commentsService.createNewComment(req.body, req.userId!, req.params.id)
        if(!newCommentId) {
            console.log(newCommentId)
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        const newComment = await commentsQueryRepository.findCommentById(newCommentId)
        if(!newComment) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newComment)
    },
}