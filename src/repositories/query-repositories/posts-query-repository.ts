import {PostsViewSortPaginationModel} from "../../models/posts-models/posts-view-sort-pagin-model";
import {PostModel} from "../../models/posts-models/PostModel";
import {postsCollections} from "../../db/db";
import {mapPosts} from "../../utils/helpers/map-posts";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {PostsPaginationSortQueryModel} from "../../models/request-models/posts-paginations-sort-query-model";
import {SortByEnum} from "../../enum/sort-by-enum";

export const postsQueryRepository = {
    async getAllPost(query: PostsPaginationSortQueryModel): Promise<PostsViewSortPaginationModel> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize)
        const {skipPage, pagesCount, totalCount} = processingResult

        const arrPosts: PostModel[] = await postsCollections
            .find({})
            .sort({[sortBy]: sortDirection})
            .limit(pageSize)
            .skip(skipPage)
            .toArray()
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: arrPosts.map(post => mapPosts(post))
        }
    },

    async getAllPostsForBlog(query: PostsPaginationSortQueryModel, blogId: string): Promise<PostsViewSortPaginationModel | boolean> {
        const aggregationResult = await this._aggregationOfQueryParameters(query)
        const {sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, blogId, SortByEnum.blogId)
        const {skipPage, pagesCount, totalCount} = processingResult

        const arrPosts: PostModel[] = await postsCollections
            .find({blogId: blogId})
            .sort({[sortBy]: sortDirection})
            .limit(pageSize)
            .skip(skipPage)
            .toArray()

        if (arrPosts.length <= 0) {
            return false
        }

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: arrPosts.map(post => mapPosts(post))
        }
    },

    _aggregationOfQueryParameters: (query: PostsPaginationSortQueryModel): Required<PostsPaginationSortQueryModel> => {
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