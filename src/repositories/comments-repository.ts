import {commentCollections} from "../db/db";
import {ObjectId} from "mongodb";

export const commentsRepository = {

    async createNewComment(newComment: any) : Promise<ObjectId> {
        const resultInsert = await commentCollections.insertOne(newComment)
        return resultInsert.insertedId
    }
}