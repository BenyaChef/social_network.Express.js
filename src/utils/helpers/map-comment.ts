import {CommentDbModel} from "../../models/comment-models/comment-db-model";
import {WithId} from "mongodb";
import {LikesStatus} from "../../enum/likes-status-enum";
import {LikesInfoModel} from "../../models/comment-models/likes-info-model";

export const mapComment = (comment: WithId<CommentDbModel>, likesInfo: LikesInfoModel) => {
    return {
        id: comment._id!.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            dislikesCount: likesInfo?.dislikesCount || 0,
            likesCount: likesInfo?.likesCount || 0,
            myStatus: likesInfo?.myStatus || LikesStatus.None
        }
    }
}