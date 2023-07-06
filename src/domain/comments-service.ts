import "reflect-metadata";
import {ObjectId, WithId} from "mongodb";
import {InputCommentModel} from "../models/comment-models/input-coment-model";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {UsersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {CommentsQueryRepository,} from "../repositories/query-repositories/comments-query-repository";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {CommentClass} from "../classes/comment-class";
import {LikeInputModel} from "../models/comment-models/like-model";
import {Like} from "../classes/like-class";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async processingLikeStatus(body: LikeInputModel, commentId: string, userId: ObjectId) {
        const findLike = await this.commentsRepository.findLikeCommentThisUser(commentId, userId)
        if (!findLike) {
            const newLike = new Like(userId, commentId, body.likeStatus)
            await this.commentsRepository.saveLike(newLike)
            return resultCodeMap(true, null)
        }
        const resultCheckLikeStatus = Like.likeStatusCheck(findLike!.myStatus, body.likeStatus)
        if (!resultCheckLikeStatus) {
            return resultCodeMap(true, null)
        }
        const resultUpdateLike = await this.commentsRepository.updateLike(resultCheckLikeStatus, userId, commentId)
        if (!resultUpdateLike) return resultCodeMap(false, null, Errors.Error_Server)
        return resultCodeMap(true, null)
    }

    async createNewComment(body: InputCommentModel, userId: ObjectId, postId: string): Promise<ObjectId | null> {
        const user: WithId<AdminDbModel> | null = await this.usersQueryRepository.findUserById(userId)
        if (!user) {
            return null
        }
        const post = await this.postsQueryRepository.findPostByID(postId)
        if (!post) {
            return null
        }
        const userDto = {
            userId: user._id.toString(),
            userLogin: user.login
        }
        const newComment: CommentDbModel = new CommentClass(body.content, userDto, postId)
        return await this.commentsRepository.createNewComment(newComment)
    }

    async updateComments(body: InputCommentModel, userId: ObjectId, commentId: string): Promise<ResultCodeHandler<null>> {
        const findComment = await this.commentsRepository.findCommentById(commentId)
        if (!findComment) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if (userId.toString() !== findComment.commentatorInfo.userId) {
            return resultCodeMap(false, null, Errors.Forbidden)
        }
        const updateComment = {content: body.content}
        const resultUpdate = await this.commentsRepository.updateCommentById(updateComment, commentId)
        if (!resultUpdate) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }

    async deleteComment(id: string, userId: ObjectId): Promise<ResultCodeHandler<null>> {
        const findComment = await this.commentsQueryRepository.findCommentById(id)
        if (!findComment) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if (userId.toString() !== findComment.commentatorInfo.userId) {
            return resultCodeMap(false, null, Errors.Forbidden)
        }
        const resultDelete = this.commentsRepository.deleteComment(findComment.id!)
        if (!resultDelete) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }


}
