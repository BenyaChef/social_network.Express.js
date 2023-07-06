import mongoose from "mongoose";
import {LikeModel} from "../../models/comment-models/like-model";
import {WithId} from "mongodb";

export const LikesSchema = new mongoose.Schema<WithId<LikeModel>>({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    parentId: {type: String, required: true},
    myStatus: {type: String, required: true},
    addedAt: {type: String, required: true},
    userName: {type: String, required: false}
})