import {ObjectId} from "mongodb";
import {InputCommentModel} from "../models/comment-models/input-coment-model";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";

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
    }
}