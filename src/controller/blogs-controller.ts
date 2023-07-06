import "reflect-metadata";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/request-models/request-types";
import {Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {BlogsService} from "../domain/blogs-service";
import {BlogViewModel} from "../models/blogs-models/blog-view-model";
import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {BlogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {BlogsPaginationSortQueryModel} from "../models/request-models/blogs-pagination-sort-query-model";
import {BlogsViewSortPaginationModel} from "../models/blogs-models/blogs-view-sort-pagin-model";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {PostsPaginationSortQueryModel} from "../models/request-models/posts-paginations-sort-query-model";
import {PostsViewSortPaginationModel} from "../models/posts-models/posts-view-sort-pagin-model";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {Errors} from "../enum/errors";
import {PostsService} from "../domain/posts-service";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
                @inject(BlogsService) protected blogsService: BlogsService,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(PostsService) protected postsService: PostsService) {
    }

    async getAllBlogs(req: RequestWithQuery<BlogsPaginationSortQueryModel>,
                      res: Response<BlogsViewSortPaginationModel>) {
        const resultSearch: BlogsViewSortPaginationModel = await this.blogsQueryRepository.getAllBlogs(req.query)
        return res.status(HTTP_STATUS.OK).send(resultSearch)
    }

    async findBlogById(req: RequestWithParams<{ id: string }>,
                       res: Response<BlogViewModel>) {
        const foundBlog: BlogViewModel | null = await this.blogsQueryRepository.findBlogByID(req.params.id)
        if (!foundBlog) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(foundBlog)
    }

    async getAllPostsForBlog(req: RequestWithParamsAndQuery<{ id: string }, PostsPaginationSortQueryModel>,
                             res: Response<PostsViewSortPaginationModel>) {
        const foundPosts: PostsViewSortPaginationModel | null = await this.postsQueryRepository.getAllPostsForBlog(req.query, req.params.id, req.userId)
        if (!foundPosts) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(foundPosts)
    }

    async createNewPostForBlog(req: RequestWithParamsAndBody<{ id: string }, CreatePostModel>,
                               res: Response<PostViewModel>) {
        const newPostResult = await this.postsService.createNewPostForBlog(req.params.id, req.body)
        if (newPostResult.error === Errors.Not_Found) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        const newPostId = newPostResult.data!.toString()
        const newPost = await this.postsQueryRepository.findPostByID(newPostId)
        if (!newPost) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newPost)
    }

    async createNewBlog(req: RequestWithBody<CreateBlogModel>,
                        res: Response<BlogViewModel>) {
        const newBlogId: string = await this.blogsService.createNewBlog(req.body)

        const newBlog = await this.blogsQueryRepository.findBlogByID(newBlogId.toString())
        if (!newBlog) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newBlog)
    }

    async updateBlogByID(req: RequestWithParamsAndBody<{ id: string }, UpdateBlogModel>,
                         res: Response) {
        const isUpdate = await this.blogsService.updateBlogByID(req.params.id, req.body)
        if (isUpdate.error === Errors.Not_Found) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }

    async deleteBlogByID(req: RequestWithParams<{ id: string }>,
                         res: Response) {
        const isDeleted = await this.blogsService.deleteBlogByID(req.params.id)
        if (isDeleted.error === Errors.Not_Found) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}

