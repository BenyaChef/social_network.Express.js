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


export const postRouter = Router({})

postRouter.get('/', async (req: Request,
                           res: Response<PostViewModel[]>) => {
    res.status(200).send(await postsRepository.getAllPost())
})
postRouter.get('/:id',
    idValidationMiddleware,
    idInputMiddleware,
    async (req: RequestWithParams<{ id: string }>,
           res: Response<PostViewModel | boolean>) => {
        const isFind = await postsRepository.findPostByID(req.params.id)
        if (!isFind) return res.sendStatus(404)
        return res.status(200).send(isFind)
    })
postRouter.post('/',
    authorizationMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithBody<CreatePostModel>,
           res: Response<PostViewModel | boolean>) => {
        const newPost = await postsRepository.createNewPost(req.body)
        if (!newPost) return res.sendStatus(400)
        return res.status(201).send(newPost)
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
        if (!isUpdate) return res.sendStatus(404)
        return res.sendStatus(204)
    })
postRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    async (req: RequestWithParams<{ id: string }>,
           res: Response) => {
        const isDelete = await postsRepository.deletePostByID(req.params.id)
        if (!isDelete) return res.sendStatus(404)
        return res.sendStatus(204)
    })
