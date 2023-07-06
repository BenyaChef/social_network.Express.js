import "reflect-metadata";
import {BlogModel} from "../../models/blogs-models/blog-model";
import {BlogsModel} from "../../db/db";
import {mapBlogs} from "../../utils/helpers/map-blogs";
import {BlogsPaginationSortQueryModel} from "../../models/request-models/blogs-pagination-sort-query-model";
import {BlogsViewSortPaginationModel} from "../../models/blogs-models/blogs-view-sort-pagin-model";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {SortByEnum} from "../../enum/sort-by-enum";
import {BlogViewModel} from "../../models/blogs-models/blog-view-model";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogsQueryRepository {
    async findBlogByID(id: string): Promise<BlogViewModel | null> {
        const isFind: BlogModel | null = await BlogsModel.findOne({_id: new ObjectId(id)})
        if (!isFind) return null
        return mapBlogs(isFind);

    }

    async getAllBlogs(query: BlogsPaginationSortQueryModel): Promise<BlogsViewSortPaginationModel> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const searchName = searchNameTerm !== null ? {name: {$regex: searchNameTerm, $options: 'ix'}} : {}

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, searchName)
        const {skipPage, totalCount, pagesCount} = processingResult

        const arrBlogs: BlogModel[] = await BlogsModel
            .find(searchName)
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .lean()
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: arrBlogs.map(mapBlogs)
        }
    }

    _aggregationOfQueryParameters(query: BlogsPaginationSortQueryModel): Required<BlogsPaginationSortQueryModel> {
        const paramSortPagination = {
            searchNameTerm: query.searchNameTerm || null,
            sortBy: query.sortBy || SortByEnum.createdAt,
            sortDirection: query.sortDirection || SortDirectionEnum.desc,
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return paramSortPagination
    }


    async _processingPagesAndNumberOfDocuments(pageNumber: number, pageSize: number, searchParamOne: object) {
        const skipPage = (pageNumber - 1) * pageSize
        const totalCount = await BlogsModel.countDocuments(searchParamOne)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            skipPage,
            totalCount,
            pagesCount
        }
    }
}

export const blogsQueryRepository = new BlogsQueryRepository()