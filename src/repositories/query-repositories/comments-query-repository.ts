import "reflect-metadata";
import {ObjectId, WithId} from "mongodb";
import {CommentsModel, LikesModel} from "../../db/db";
import {mapComment} from "../../utils/helpers/map-comment";
import {CommentViewModel} from "../../models/comment-models/comment-view-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {CommentPaginationModel} from "../../models/request-models/comment-pagination-model";
import {CommentDbModel} from "../../models/comment-models/comment-db-model";
import {CommentPaginationViewModel} from "../../models/comment-models/comment-pagination-view-model";
import {LikesStatus} from "../../enum/likes-status-enum";
import {injectable} from "inversify";


@injectable()
export class CommentsQueryRepository {

    async findCommentById(commentId: string, userId?: ObjectId | null): Promise<CommentViewModel | null> {
        const findComment = await CommentsModel.findOne({_id: new ObjectId(commentId)})
        if (!findComment) return null

        const resultProcessingDataLike = await this._likesDataProcessing(commentId, userId)
        return mapComment(findComment, resultProcessingDataLike)
    }

    async findAllCommentByPostId(query: CommentPaginationModel, postId: string, userId?: ObjectId | null): Promise<CommentPaginationViewModel | null> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, postId, SortByEnum.postId)
        const {skipPage, pagesCount, totalCount} = processingResult

        const commentsArray: Array<WithId<CommentDbModel>> = await CommentsModel
            .find({postId: postId})
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .lean()

        if (commentsArray.length <= 0) {
            return null
        }

        const commentItems = []
        for (const comment of commentsArray) {
            const resultProcessingDataLike = await this._likesDataProcessing(comment._id.toString(), userId)
            commentItems.push(mapComment(comment, resultProcessingDataLike))
        }

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: commentItems
        }
    }

    private _aggregationOfQueryParameters(query: CommentPaginationModel): Required<CommentPaginationModel> {
        const paramSortPagination = {
            sortBy: query.sortBy || SortByEnum.createdAt,
            sortDirection: query.sortDirection || SortDirectionEnum.desc,
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return paramSortPagination
    }

    private async _processingPagesAndNumberOfDocuments(pageNumber: number, pageSize: number, value?: string, field?: string) {
        const skipPage = (pageNumber - 1) * pageSize
        const filter = field !== undefined ? {[field]: value} : {}
        const totalCount = await CommentsModel.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            skipPage,
            totalCount,
            pagesCount
        }
    }

    private async _likesDataProcessing(commentId: string, userId?: ObjectId | null) {
        const totalLike = await LikesModel.countDocuments({ parentId: commentId, myStatus: 'Like' })
        const totalDisLike = await LikesModel.countDocuments({ parentId: commentId, myStatus: 'Dislike' })
        if(!userId) {
            return {
                dislikesCount: totalDisLike,
                likesCount: totalLike,
                myStatus: LikesStatus.None
            }
        }
        const  likeStatusUser = await LikesModel.findOne({$and: [{userId: userId}, {parentId: commentId}]})
        return {
            dislikesCount: totalDisLike,
            likesCount: totalLike,
            myStatus: likeStatusUser !== null ? likeStatusUser.myStatus : LikesStatus.None
        }

    }

}

