import {ObjectId} from "mongodb";
import {commentCollections, postsCollections} from "../../db/db";
import {mapComment} from "../../utils/helpers/map-comment";
import {CommentViewModel} from "../../models/comment-models/comment-view-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {CommentPaginationModel} from "../../models/request-models/comment-pagination-model";
import {CommentDbModel} from "../../models/comment-models/comment-db-model";
import {CommentPaginationViewModel} from "../../models/comment-models/comment-pagination-view-model";

export const commentsQueryRepository = {

    async findCommentById(id: ObjectId) : Promise<CommentViewModel | null> {
        const findComment = await commentCollections.findOne({_id: id})
        if (!findComment) {
            return null
        }
        return mapComment(findComment)
    },

    async findAllCommentByPostId(query: CommentPaginationModel, id: string) : Promise<CommentPaginationViewModel | null> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize)
        const {skipPage, pagesCount, totalCount} = processingResult

        const commentsArray: CommentDbModel[] = await commentCollections
            .find({postId: id})
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .toArray()

        if(commentsArray.length <= 0) {
            return null
        }
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: commentsArray.map(mapComment)
        }
    },

    _aggregationOfQueryParameters: (query: CommentPaginationModel) : Required<CommentPaginationModel> => {
        const paramSortPagination = {
            sortBy: query.sortBy || SortByEnum.createdAt,
            sortDirection: query.sortDirection || SortDirectionEnum.desc,
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return paramSortPagination
    },

    _processingPagesAndNumberOfDocuments: async (pageNumber: number, pageSize: number, value?: string, field?: string) => {
        const skipPage = (pageNumber - 1) * pageSize
        const filter = field !== undefined ? {[field]: value} : {}
        const totalCount = await postsCollections.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            skipPage,
            totalCount,
            pagesCount
        }
    },
}