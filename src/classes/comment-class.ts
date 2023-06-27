import {CommentatorInfoModel} from "../models/comment-models/commentator-info-model";

export class CommentClass {
    createdAt: string
    commentatorInfo : CommentatorInfoModel
    constructor(public content: string, public userId: string, public userLogin: string, public postId: string) {
        this.createdAt = new Date().toISOString()
        this.commentatorInfo = {userId, userLogin}
    }
}