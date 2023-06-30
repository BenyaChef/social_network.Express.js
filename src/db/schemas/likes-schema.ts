import mongoose from "mongoose";
import {LikeModel} from "../../models/comment-models/like-model";
import {ObjectId, WithId} from "mongodb";

export const LikesSchema = new mongoose.Schema<WithId<LikeModel>>({
    userId: {type: ObjectId, required: true},
    commentId: {type: String, required: true},
    myStatus: {type: String, required: true}
})