import {commentCollections} from "../db/db";
import {ObjectId} from "mongodb";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {InputCommentModel} from "../models/comment-models/input-coment-model";

export const commentsRepository = {

    async findCommentById(id: string) : Promise<CommentDbModel | null> {
        return await commentCollections.findOne({_id: new ObjectId(id)})
    },

    async createNewComment(newComment: CommentDbModel) : Promise<ObjectId> {
        const resultInsert = await commentCollections.insertOne(newComment)
        return resultInsert.insertedId
    },

    async updateCommentById(newComment: InputCommentModel, commentId: string) : Promise<boolean> {
        const resultUpdate = await commentCollections.updateOne({_id: new ObjectId(commentId)}, {$set: newComment})
        return resultUpdate.matchedCount === 1
    },

    async deleteComment(id: ObjectId | string) : Promise<boolean> {
        const resultDelete = await commentCollections.deleteOne({_id: new ObjectId(id)})
        return resultDelete.deletedCount === 1
    }
}