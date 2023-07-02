
import {CommentatorInfoModel} from "./commentator-info-model";
import {LikesInfoModel} from "./likes-info-model";

export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentatorInfoModel
    createdAt: string
    likesInfo: LikesInfoModel
}