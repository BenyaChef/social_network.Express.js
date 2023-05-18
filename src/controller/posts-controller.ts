import {Request, Response} from "express";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {postsService} from "../domain/posts-service";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../models/request-models/RequestTypes";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";

export const postsController = {

    async getAllPost(req: Request,
                     res: Response<PostViewModel[]>) {
        res.status(HTTP_STATUS.OK).send(await postsService.getAllPost())
    },

    async getPostById(req: RequestWithParams<{ id: string }>,
                      res: Response<PostViewModel | boolean>) {
        const isFind = await postsService.findPostByID(req.params.id)
        if (!isFind) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(isFind)
    },

    async createNewPost(req: RequestWithBody<CreatePostModel>,
                        res: Response<PostViewModel | boolean>) {
        const newPost = await postsService.createNewPost(req.body)
        if (!newPost) {
            return res.sendStatus(HTTP_STATUS.Bad_request)
        }
        return res.status(HTTP_STATUS.Created).send(newPost)
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