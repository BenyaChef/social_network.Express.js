import {CommentDbModel} from "../../models/comment-models/comment-db-model";
import {CommentViewModel} from "../../models/comment-models/comment-view-model";
import {WithId} from "mongodb";

export const mapComment = (comment: WithId<CommentDbModel>) : CommentViewModel => {
    return {
        id: comment._id!.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    }
}