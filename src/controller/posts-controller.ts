import "reflect-metadata";
import {Response} from "express";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {PostsService} from "../domain/posts-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../models/request-models/request-types";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {PostsViewSortPaginationModel} from "../models/posts-models/posts-view-sort-pagin-model";
import {PostsPaginationSortQueryModel} from "../models/request-models/posts-paginations-sort-query-model";
import {Errors} from "../enum/errors";
import {ErrorsMessages} from "../enum/errors-message";
import {inject, injectable} from "inversify";
import {IdType} from "../models/id-type";
import {LikeInputModel} from "../models/comment-models/like-model";


@injectable()
export class PostsController {
    constructor(@inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(PostsService) protected postsService: PostsService) {
    }

    async getAllPost(req: RequestWithQuery<PostsPaginationSortQueryModel>,
                     res: Response<PostsViewSortPaginationModel | boolean>) {
        const searchResult: PostsViewSortPaginationModel | boolean = await this.postsQueryRepository.getAllPost(req.query, req.userId)
        return res.status(HTTP_STATUS.OK).send(searchResult)
    }

    async getPostById(req: RequestWithParams<IdType>,
                      res: Response<PostViewModel>) {
        const isFind = await this.postsQueryRepository.findPostByID(req.params.id, req.userId)
        if (!isFind) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.OK).send(isFind)
    }

    async createNewPost(req: RequestWithBody<CreatePostModel>,
                        res: Response) {
        const newPostResult = await this.postsService.createNewPost(req.body)
        if (!newPostResult.success) {
            return res.sendStatus(HTTP_STATUS.Bad_request)
        }
        const newPostId = newPostResult.data!.toString()
        const newPost = await this.postsQueryRepository.findPostByID(newPostId)
        if (!newPost) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(newPost)
    }

    async updatePostByID(req: RequestWithParamsAndBody<IdType, UpdatePostModel>,
                         res: Response) {
        const isUpdateResult = await this.postsService.updatePostByID(req.params.id, req.body)
        if (isUpdateResult.error === Errors.Bad_Request) {
            return res.status(HTTP_STATUS.Bad_request).json(ErrorsMessages.errorsMessages)
        }
        if (isUpdateResult.error === Errors.Not_Found) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }

    async processingLikeStatus(req: RequestWithParamsAndBody<IdType, LikeInputModel>, res: Response) {
        const findPost = await this.postsQueryRepository.findPostByID(req.params.id, req.userId)
        if (!findPost) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        const result = await this.postsService.processingLikeStatus(req.body, req.params.id, req.userId!)
        if(!result.success) {
            return res.sendStatus(HTTP_STATUS.Server_error)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }

    async deletePostByID(req: RequestWithParams<IdType>,
                         res: Response) {
        const isDelete = await this.postsService.deletePostByID(req.params.id)
        if (!isDelete.success) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}
