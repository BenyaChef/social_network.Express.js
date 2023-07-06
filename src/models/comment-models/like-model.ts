import {LikesStatus} from "../../enum/likes-status-enum";
import {ObjectId} from "mongodb";

export interface LikeModel {
    userId: ObjectId
    parentId: string
    addedAt: string
    userName: string
    myStatus: LikesStatus
}

export interface LikeInputModel {
    likeStatus: LikesStatus
}

export type newestLikesType = {
    addedAt: string,
    userId: ObjectId,
    login: string
}