import {CommentatorInfoModel} from "./commentator-info-model";

export interface CommentDbModel {
    content: string
    commentatorInfo: CommentatorInfoModel
    createdAt: string
    postId: string
}