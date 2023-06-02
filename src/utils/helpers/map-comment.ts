import {CommentDbModel} from "../../models/comment-models/comment-db-model";
import {CommentViewModel} from "../../models/comment-models/comment-view-model";

export const mapComment = (comment: CommentDbModel) : CommentViewModel => {
    return {
        id: comment._id!.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    }
}