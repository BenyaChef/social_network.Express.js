import {PostsViewSortPaginationModel} from "../../models/posts-models/posts-view-sort-pagin-model";
import {PostModel} from "../../models/posts-models/PostModel";
import {postsCollections} from "../../db/db";
import {mapPosts} from "../../utils/helpers/map-posts";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {PostsPaginationSortQueryModel} from "../../models/request-models/posts-paginations-sort-query-model";
import {SortByEnum} from "../../enum/sort-by-enum";

export const postsQueryRepository = {
    async getAllPost(query: PostsPaginationSortQueryModel) : Promise<PostsViewSortPaginationModel> {
        const queryResult = await this._paginationAndSortToQueryParam(query)
        const arrPosts: PostModel[] = await postsCollections
            .find({})
            .sort({[queryResult.sortBy]: queryResult.sortDirection})
            .limit(+queryResult.pageSize)
            .skip(queryResult.skipPage)
            .toArray()
        return {
            pagesCount: queryResult.pagesCount,
            page: +queryResult.pageNumber,
            pageSize: +queryResult.pageSize,
            totalCount: queryResult.totalCount,
            items: arrPosts.map(post => mapPosts(post))
        }
    },

    async getAllPostsForBlog(query: PostsPaginationSortQueryModel, blogId: string) : Promise<PostsViewSortPaginationModel | boolean> {
        const queryResult = await this._paginationAndSortToQueryParam(query, blogId)
        const arrPosts: PostModel[] = await postsCollections
            .find({blogId: blogId})
            .sort({[queryResult.sortBy]: queryResult.sortDirection})
            .limit(+queryResult.pageSize)
            .skip(queryResult.skipPage)
            .toArray()
        if(arrPosts.length <= 0) {
            return false
        }
        return {
            pagesCount: queryResult.pagesCount,
            page: +queryResult.pageNumber,
            pageSize: +queryResult.pageSize,
            totalCount: queryResult.totalCount,
            items: arrPosts.map(post => mapPosts(post))
        }
    },

    _paginationAndSortToQueryParam: async (query: PostsPaginationSortQueryModel, blogId?: string) => {
        const {sortBy, sortDirection, pageNumber, pageSize} = query
        const paramSortPagination: PostsPaginationSortQueryModel = {
            sortBy: sortBy || SortByEnum.createdAt,
            sortDirection: sortDirection || SortDirectionEnum.desc,
            pageNumber: pageNumber || 1,
            pageSize: pageSize || 10
        }
        const skipPage = (paramSortPagination.pageNumber - 1) * paramSortPagination.pageSize
        const totalCount = blogId ? await postsCollections.countDocuments({blogId}) : await postsCollections.countDocuments()
        const pagesCount = Math.ceil(totalCount / paramSortPagination.pageSize)
        return {
            ...paramSortPagination,
            skipPage,
            totalCount,
            pagesCount
        }

    },

}