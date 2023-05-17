import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {postValidationMiddleware} from "../middlewares/post-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../models/request-models/RequestTypes";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {idInputMiddleware} from "../middlewares/id-input-middleware";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {postsService} from "../domain/posts-service";

export const postRouter = Router({})

postRouter.get('/', async (req: Request,
                           res: Response<PostViewModel[]>) => {
    res.status(HTTP_STATUS.OK).send(await postsService.getAllPost())
})
postRouter.get('/:id',
    idValidationMiddleware,
    idInputMiddleware,
    async (req: RequestWithParams<{ id: string }>,
           res: Response<PostViewModel | boolean>) => {
        const isFind = await postsRepository.findPostByID(req.params.id)
        if (!isFind) return res.sendStatus(HTTP_STATUS.Not_found)
        return res.status(HTTP_STATUS.OK).send(isFind)
    })
postRouter.post('/',
    authorizationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithBody<CreatePostModel>,
           res: Response<PostViewModel | boolean>) => {
        const newPost = await postsRepository.createNewPost(req.body)
        if (!newPost) return res.sendStatus(HTTP_STATUS.Bad_request)
        return res.status(HTTP_STATUS.Created).send(newPost)
    })
postRouter.put('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{ id: string }, UpdatePostModel>,
           res: Response) => {
        const isUpdate = await postsRepository.updatePostByID(req.params.id, req.body)
        if (!isUpdate) return res.sendStatus(HTTP_STATUS.Not_found)
        return res.sendStatus(HTTP_STATUS.No_content)
    })
postRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    async (req: RequestWithParams<{ id: string }>,
           res: Response) => {
        const isDelete = await postsRepository.deletePostByID(req.params.id)
        if (!isDelete) return res.sendStatus(HTTP_STATUS.Not_found)
        return res.sendStatus(HTTP_STATUS.No_content)
    })
