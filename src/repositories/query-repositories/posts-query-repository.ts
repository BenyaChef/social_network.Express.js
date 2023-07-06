import "reflect-metadata";
import {PostsViewSortPaginationModel} from "../../models/posts-models/posts-view-sort-pagin-model";
import {PostModel} from "../../models/posts-models/PostModel";
import {LikesModel, PostsModel, UsersModel} from "../../db/db";
import {mapPosts} from "../../utils/helpers/map-posts";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {PostsPaginationSortQueryModel} from "../../models/request-models/posts-paginations-sort-query-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {PostViewModel} from "../../models/posts-models/PostViewModel";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";


@injectable()
export class PostsQueryRepository {

    async findPostByID(postId: string, userId: ObjectId | null = null): Promise<PostViewModel | null> {
        const findPost: WithId<PostModel> | null = await PostsModel.findOne({_id: new ObjectId(postId)})
        if (!findPost) return null

        return mapPosts(findPost, userId)
    }


    async getAllPost(query: PostsPaginationSortQueryModel, userId: ObjectId | null = null): Promise<PostsViewSortPaginationModel | boolean> {
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
            items: arrPosts.map(post => mapPosts(post, userId))
        }

    }

    async getAllPostsForBlog(query: PostsPaginationSortQueryModel, blogId: string, userId: ObjectId | null = null): Promise<PostsViewSortPaginationModel | null> {
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
            items: arrPosts.map(post => mapPosts(post, userId))
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

