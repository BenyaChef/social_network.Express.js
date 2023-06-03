import {ObjectId} from "mongodb";
import {InputCommentModel} from "../models/comment-models/input-coment-model";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";

export const commentsService = {

    async createNewComment(body: InputCommentModel, userId: ObjectId, postId: string) : Promise<ObjectId | null> {
        const user = await usersQueryRepository.getUserByIdByToken(userId)
        if(!user) {
            return null
        }
        const post = await postsQueryRepository.findPostByID(postId)
        if(!post) {
            return null
        }
        const newComment: CommentDbModel = {
            content: body.content,
            commentatorInfo: {
                userId: user.userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: post.id
        }
        return await commentsRepository.createNewComment(newComment)
    },

    async updateComments(body: InputCommentModel, userId: ObjectId, commentId: string) : Promise<ResultCodeHandler<null>> {
            const findComment = await commentsRepository.findCommentById(commentId)
        if(!findComment) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if(userId.toString() !== findComment.commentatorInfo.userId) {
            return resultCodeMap(false, null, Errors.Forbidden)
        }
        const updateComment = {content: body.content}
        const resultUpdate = await commentsRepository.updateCommentById(updateComment, commentId)
        if(!resultUpdate) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }
}