import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/request-models/request-types";
import {Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {blogsService} from "../domain/blogs-service";
import {BlogViewModel} from "../models/blogs-models/blog-view-model";
import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {BlogsPaginationSortQueryModel} from "../models/request-models/blogs-pagination-sort-query-model";
import {BlogsViewSortPaginationModel} from "../models/blogs-models/blogs-view-sort-pagin-model";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {PostsPaginationSortQueryModel} from "../models/request-models/posts-paginations-sort-query-model";
import {PostsViewSortPaginationModel} from "../models/posts-models/posts-view-sort-pagin-model";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {postsService} from "../domain/posts-service";
import {ObjectId} from "mongodb";
import {checkResultCode} from "../utils/helpers/check-result-code";


export const blogsController = {

    async getAllBlogs(req: RequestWithQuery<BlogsPaginationSortQueryModel>,
                      res: Response<BlogsViewSortPaginationModel | boolean>) {
        const resultSearch: BlogsViewSortPaginationModel | boolean = await blogsQueryRepository.getAllBlogs(req.query)
        return res.status(HTTP_STATUS.OK).send(resultSearch)
    },

    async findBlogById(req: RequestWithParams<{ id: string }>,
                       res: Response<BlogViewModel>) {
        const foundBlog: BlogViewModel | null = await blogsQueryRepository.findBlogByID(req.params.id)
        if (!foundBlog) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(foundBlog)
    },

    async getAllPostsForBlog(req: RequestWithParamsAndQuery<{ id: string }, PostsPaginationSortQueryModel>,
                             res: Response<PostsViewSortPaginationModel>) {
        const foundPosts: PostsViewSortPaginationModel | null = await postsQueryRepository.getAllPostsForBlog(req.query, req.params.id)
        if (!foundPosts) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(foundPosts)
    },

    async createNewPostForBlog(req: RequestWithParamsAndBody<{ id: string }, CreatePostModel>,
                               res: Response<PostViewModel>) {
        const newPostResult = await postsService.createNewPostForBlog(req.params.id, req.body)
        if (!newPostResult.success) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        const newPostId = newPostResult.data!.toString()
        const newPost = await postsQueryRepository.findPostByID(newPostId)
        if(!newPost) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newPost)
    },

    async createNewBlog(req: RequestWithBody<CreateBlogModel>,
                        res: Response<BlogViewModel | boolean>) {
        const newBlogId: ObjectId | boolean = await blogsService.createNewBlog(req.body)
        if (!newBlogId) {
            return res.sendStatus(HTTP_STATUS.Server_error)
        }
        const newBlog = await blogsQueryRepository.findBlogByID(newBlogId.toString())
        if (!newBlog) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newBlog)
    },

    async updateBlogByID(req: RequestWithParamsAndBody<{ id: string }, UpdateBlogModel>,
                         res: Response) {
        const isUpdate: boolean = await blogsService.updateBlogByID(req.params.id, req.body)
        if (!isUpdate) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    },

    async deleteBlogByID(req: RequestWithParams<{ id: string }>,
                         res: Response) {
        const isDeleted: boolean = await blogsService.deleteBlogByID(req.params.id)
        if (!isDeleted) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}