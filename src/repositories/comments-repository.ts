import {CommentsModel} from "../db/db";
import {ObjectId} from "mongodb";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {InputCommentModel} from "../models/comment-models/input-coment-model";

class CommentsRepository {

    async findCommentById(id: string) : Promise<CommentDbModel | null> {
        return CommentsModel.findOne({_id: new ObjectId(id)})
    }

    async createNewComment(newComment: CommentDbModel) : Promise<ObjectId> {
        const resultInsert = await CommentsModel.create(newComment)
        return resultInsert.id
    }

    async updateCommentById(newComment: InputCommentModel, commentId: string) : Promise<boolean> {
        const resultUpdate = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$set: newComment})
        return resultUpdate.matchedCount === 1
    }

    async deleteComment(id: ObjectId | string) : Promise<boolean> {
        const resultDelete = await CommentsModel.deleteOne({_id: new ObjectId(id)})
        return resultDelete.deletedCount === 1
    }
}

export const commentsRepository = new CommentsRepository()