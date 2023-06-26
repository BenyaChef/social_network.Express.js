import mongoose from "mongoose";
import {CommentatorInfoModel} from "../../models/comment-models/commentator-info-model";
import {CommentDbModel} from "../../models/comment-models/comment-db-model";

const CommentatorInfoSchema = new mongoose.Schema<CommentatorInfoModel>({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
});

export const CommentsSchema = new mongoose.Schema<CommentDbModel>({
    content: {type: String, require: true},
    commentatorInfo: CommentatorInfoSchema,
    createdAt: {type: String, require: true},
    postId: {type: String, require: true},
})