import "reflect-metadata";
import {CommentsModel, LikesModel} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {InputCommentModel} from "../models/comment-models/input-coment-model";
import {Like} from "../classes/like-class";
import {LikesStatus} from "../enum/likes-status-enum";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {

    async updateLike(newStatusLike: LikesStatus, userId: ObjectId, commentId: string) {
        const updateResult = await LikesModel.findOneAndUpdate({$and: [{userId: userId}, {parentId: commentId}]}, {$set: {myStatus: newStatusLike}})
        return updateResult

    }

    async saveLike(newLike: Like): Promise<string> {
        const saveResult = await LikesModel.create(newLike)
        return saveResult.id
    }

    async findLikeCommentThisUser(commentId: string, userId: ObjectId) {
        return LikesModel.findOne({$and: [{userId: userId}, {parentId: commentId}]})
    }

    async findCommentById(id: string): Promise<WithId<CommentDbModel> | null> {
        return CommentsModel.findOne({_id: new ObjectId(id)})

    }

    async createNewComment(newComment: CommentDbModel): Promise<ObjectId> {
        const resultInsert = await CommentsModel.create(newComment)
        return resultInsert.id
    }

    async updateCommentById(newComment: InputCommentModel, commentId: string): Promise<boolean> {
        const resultUpdate = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$set: newComment})
        return resultUpdate.matchedCount === 1
    }

    async deleteComment(id: ObjectId | string): Promise<boolean> {
        const resultDelete = await CommentsModel.deleteOne({_id: new ObjectId(id)})
        return resultDelete.deletedCount === 1
    }
}

