import {ObjectId} from "mongodb";
import {commentCollections} from "../../db/db";
import {mapComment} from "../../utils/helpers/map-comment";
import {CommentViewModel} from "../../models/comment-models/comment-view-model";

export const commentsQueryRepository = {

    async findCommentById(id: ObjectId) : Promise<CommentViewModel | null> {
        const findComment = await commentCollections.findOne({_id: id})
        if (!findComment) {
            return null
        }
        return mapComment(findComment)
    },

    async findAllCommentByPostId(query: any, id: string) {

    }
}