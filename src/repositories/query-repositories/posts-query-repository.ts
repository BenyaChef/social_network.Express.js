import {PostsViewSortPaginationModel} from "../../models/posts-models/posts-view-sort-pagin-model";
import {PostModel} from "../../models/posts-models/PostModel";
import {PostsModel} from "../../db/db";
import {mapPosts} from "../../utils/helpers/map-posts";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {PostsPaginationSortQueryModel} from "../../models/request-models/posts-paginations-sort-query-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {PostViewModel} from "../../models/posts-models/PostViewModel";
import {ObjectId, WithId} from "mongodb";

export class PostsQueryRepository {
    async findPostByID(id: string): Promise<PostViewModel | null> {
        const isFind: WithId<PostModel> | null = await PostsModel.findOne({_id: new ObjectId(id)})
        if (!isFind) {
            return null
        }
        return mapPosts(isFind)
    }


    async getAllPost(query: PostsPaginationSortQueryModel): Promise<PostsViewSortPaginationModel | boolean> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize)
        const {skipPage, pagesCount, totalCount} = processingResult

        const arrPosts: Array<WithId<PostModel>> = await PostsModel
            .find({})
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .lean()
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: arrPosts.map(mapPosts)
        }

    }

    async getAllPostsForBlog(query: PostsPaginationSortQueryModel, blogId: string): Promise<PostsViewSortPaginationModel | null> {
        const aggregationResult = await this._aggregationOfQueryParameters(query)
        const {sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, blogId, SortByEnum.blogId)
        const {skipPage, pagesCount, totalCount} = processingResult

        const arrPosts: Array<WithId<PostModel>> = await PostsModel
            .find({blogId: blogId})
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .lean()

        if (arrPosts.length <= 0) {
            return null
        }

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: arrPosts.map(mapPosts)
        }
    }

    _aggregationOfQueryParameters(query: PostsPaginationSortQueryModel): Required<PostsPaginationSortQueryModel> {
        const paramSortPagination = {
            sortBy: query.sortBy || SortByEnum.createdAt,
            sortDirection: query.sortDirection || SortDirectionEnum.desc,
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return paramSortPagination
    }

    async _processingPagesAndNumberOfDocuments(pageNumber: number, pageSize: number, value?: string, field?: string) {
        const skipPage = (pageNumber - 1) * pageSize
        const filter = field !== undefined ? {[field]: value} : {}
        const totalCount = await PostsModel.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            skipPage,
            totalCount,
            pagesCount
        }
    }
}

// export const postsQueryRepository = new PostsQueryRepository()