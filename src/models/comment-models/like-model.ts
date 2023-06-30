import {LikesStatus} from "../../enum/likes-status-enum";
import {ObjectId} from "mongodb";

export interface LikeModel {
    userId: ObjectId
    commentId: string
    myStatus: LikesStatus
}

export interface LikeInputModel {
    likeStatus: LikesStatus
}