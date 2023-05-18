import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../models/request-models/RequestTypes";
import {Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {blogsService} from "../domain/blogs-service";
import {BlogViewModel} from "../models/blogs-models/blog-view-model";
import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {PaginationSortQueryModel} from "../models/request-models/pagination-sort-query-model";
import {BlogsViewSortPaginationModel} from "../models/blogs-models/blogs-view-sort-pagin-model";
import {ObjectId} from "mongodb";

export const blogsController = {

    async getAllBlogs(req: RequestWithQuery<PaginationSortQueryModel>, res: Response<BlogsViewSortPaginationModel>) {
        res.status(HTTP_STATUS.OK).send(await blogsQueryRepository.getAllBlogs(req.query))
    },

    async getBlogById(req: RequestWithParams<{ id: string }>,
                      res: Response<BlogViewModel | boolean>) {
        const foundBlog: BlogViewModel | boolean = await blogsQueryRepository.findBlogByID(req.params.id)
        if (!foundBlog) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(foundBlog)
    },

    async createNewBlog(req: RequestWithBody<CreateBlogModel>,
                        res: Response<BlogViewModel | boolean>) {
        const newBlog: ObjectId = await blogsService.createNewBlog(req.body)
        if (!newBlog) {
            return res.sendStatus(HTTP_STATUS.Bad_request)
        }

        const findNewBlog: BlogViewModel | boolean = await blogsQueryRepository.findBlogByID(newBlog)
        return res.status(HTTP_STATUS.Created).send(findNewBlog)

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