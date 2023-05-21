import {BlogModel} from "../../models/blogs-models/blog-model";
import {blogsCollections} from "../../db/db";
import {mapBlogs} from "../../utils/helpers/map-blogs";
import {BlogsPaginationSortQueryModel} from "../../models/request-models/blogs-pagination-sort-query-model";
import {BlogsViewSortPaginationModel} from "../../models/blogs-models/blogs-view-sort-pagin-model";
import {SortDirectionEnum} from "../../enum/sort-direction";


export const blogsQueryRepository = {

    async getAllBlogs(query: BlogsPaginationSortQueryModel): Promise<BlogsViewSortPaginationModel> {

        const queryResult = await this._paginationAndSortToQueryParam(query)
        const arrBlogs: BlogModel[] = await blogsCollections
            .find({$or: [{name: {$regex: queryResult.searchNameTerm || '', $options: 'ix'}}]})
            .sort({[queryResult.sortBy]: queryResult.sortDirection})
            .limit(+queryResult.pageSize)
            .skip(queryResult.skipPage)
            .toArray()
        return {
            pagesCount: queryResult.pagesCount,
            page: +queryResult.pageNumber,
            pageSize: +queryResult.pageSize,
            totalCount: queryResult.totalCount,
            items: arrBlogs.map(blog => mapBlogs(blog))
        }
    },

    _paginationAndSortToQueryParam: async (query: BlogsPaginationSortQueryModel) => {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = query
        const paramSortPagination: BlogsPaginationSortQueryModel = {
            searchNameTerm: searchNameTerm || null,
            sortBy: sortBy || 'createdAt',
            sortDirection: sortDirection || SortDirectionEnum.desc,
            pageNumber: pageNumber || 1,
            pageSize: pageSize || 10
        }
        const skipPage = (paramSortPagination.pageNumber - 1) * paramSortPagination.pageSize
        const totalCount = await blogsCollections.countDocuments({$or: [{name: {$regex: searchNameTerm || '', $options: "ix"}}]})
        const pagesCount = Math.ceil(totalCount / paramSortPagination.pageSize)
        return {
            ...paramSortPagination,
            skipPage,
            totalCount,
            pagesCount
        }
    },
}