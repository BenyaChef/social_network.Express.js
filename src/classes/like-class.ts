import {ObjectId} from "mongodb";
import {LikesStatus} from "../enum/likes-status-enum";
import {LikeModel} from "../models/comment-models/like-model";


export class Like {
    addedAt: string

    constructor(public userId: ObjectId,
                public parentId: string,
                public myStatus: LikesStatus,
                public userName: string) {

        this.addedAt = new Date().toISOString()
    }

    static checkUserLike(likes: LikeModel[], userId: ObjectId) {
        const like = likes.find(like => like.userId.equals(new ObjectId(userId)))
        if (!like) return null
        return like
    }

    static likeStatusCheck(like: LikeModel, body: LikesStatus) {
        if (like.myStatus === body) {
            return null
        }
        return {
            userId: like.userId,
            parentId: like.parentId,
            addedAt: like.addedAt,
            userName: like.userName,
            myStatus: body
        }

    }
}