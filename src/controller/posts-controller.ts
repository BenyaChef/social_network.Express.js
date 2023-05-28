import {Response} from "express";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {postsService} from "../domain/posts-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../models/request-models/request-types";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {PostsViewSortPaginationModel} from "../models/posts-models/posts-view-sort-pagin-model";
import {PostsPaginationSortQueryModel} from "../models/request-models/posts-paginations-sort-query-model";
import {Errors} from "../enum/errors";

export const postsController = {

    async getAllPost(req: RequestWithQuery<PostsPaginationSortQueryModel>,
                     res: Response<PostsViewSortPaginationModel>) {
        const searchResult: PostsViewSortPaginationModel | boolean = await postsQueryRepository.getAllPost(req.query)
        if (!searchResult) {
            return res.sendStatus(HTTP_STATUS.Server_error)
        }
        return res.status(HTTP_STATUS.OK).send()
    },

    async getPostById(req: RequestWithParams<{ id: string }>,
                      res: Response<PostViewModel | boolean>) {
        const isFind = await postsQueryRepository.findPostByID(req.params.id)
        if (!isFind) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(isFind)
    },

    async createNewPost(req: RequestWithBody<CreatePostModel>,
                        res: Response<PostViewModel | boolean>) {
        const newPostResult = await postsService.createNewPost(req.body)
        if (newPostResult.error === Errors.Not_Found) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        if(newPostResult.data !== null) {
            const newPost = await postsQueryRepository.findPostByID(newPostResult.data.toString())
            return res.status(HTTP_STATUS.Created).send(newPost)
        }

    },

    async updatePostByID(req: RequestWithParamsAndBody<{ id: string }, UpdatePostModel>,
                         res: Response) {
        const isUpdate = await postsService.updatePostByID(req.params.id, req.body)
        if (!isUpdate) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    },

    async deletePostByID(req: RequestWithParams<{ id: string }>,
                         res: Response) {
        const isDelete = await postsService.deletePostByID(req.params.id)
        if (!isDelete) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}