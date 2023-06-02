import {ObjectId} from "mongodb";
import {CommentatorInfoModel} from "./commentator-info-model";

export interface CommentDbModel {
    _id?: ObjectId
    content: string
    commentatorInfo: CommentatorInfoModel
    createdAt: string
    postId: string
}