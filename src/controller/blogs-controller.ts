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


export const blogsController = {

    async getAllBlogs(req: RequestWithQuery<BlogsPaginationSortQueryModel>,
                      res: Response<BlogsViewSortPaginationModel>) {
        res.status(HTTP_STATUS.OK).send(await blogsQueryRepository.getAllBlogs(req.query))
    },

    async findBlogById(req: RequestWithParams<{ id: string }>,
                       res: Response<BlogViewModel | boolean>) {
        const foundBlog: BlogViewModel | null = await blogsService.findBlogByID(req.params.id)
        if (!foundBlog) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(foundBlog)
    },

    async getAllPostsForBlog(req: RequestWithParamsAndQuery<{ id: string }, PostsPaginationSortQueryModel>,
                             res: Response<PostsViewSortPaginationModel | boolean>) {
        const foundPosts: PostsViewSortPaginationModel | boolean = await postsQueryRepository.getAllPostsForBlog(req.query, req.params.id)
        if (!foundPosts) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(foundPosts)
    },

    async createNewPostForBlog(req: RequestWithParamsAndBody<{ id: string }, CreatePostModel>,
                               res: Response<PostViewModel>) {
        const newPost: PostViewModel | boolean = await postsService.createNewPostForBlog(req.params.id, req.body)
        if (!newPost) {
            return res.sendStatus(HTTP_STATUS.Bad_request)
        }
        return res.status(HTTP_STATUS.Created).send(newPost)
    },

    async createNewBlog(req: RequestWithBody<CreateBlogModel>,
                        res: Response<BlogViewModel>) {
        const newBlog: BlogViewModel = await blogsService.createNewBlog(req.body)
        if (!newBlog) {
            return res.sendStatus(HTTP_STATUS.Bad_request)
        }
        return res.status(HTTP_STATUS.Created).send(newBlog)
    },

    async updateBlogByID(req: RequestWithParamsAndBody<{ id: string }, UpdateBlogModel>,
                         res: Response) {
        const isUpdate = await blogsService.updateBlogByID(req.params.id, req.body)
        if (!isUpdate) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    },

    async deleteBlogByID(req: RequestWithParams<{ id: string }>,
                         res: Response) {
        const isDeleted = await blogsService.deleteBlogByID(req.params.id)
        if (!isDeleted) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}