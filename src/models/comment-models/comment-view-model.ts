
import {CommentatorInfoModel} from "./commentator-info-model";

export interface CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentatorInfoModel
    createdAt: string
}