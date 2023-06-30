import {ObjectId} from "mongodb";
import {LikesStatus} from "../enum/likes-status-enum";

export class Like {
    constructor(public userId: ObjectId,
                public commentId: string,
                public myStatus: LikesStatus) {
    }


    static async likeStatusCheck(likeStatus: LikesStatus, body: LikesStatus) {
        if(likeStatus === body) {
            return null
        }
        return body
    }

}