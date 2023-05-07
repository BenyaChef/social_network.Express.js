import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {postValidationMiddleware} from "../middlewares/post-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postDB} from "../db/postDB";


export const postRouter = Router({})

postRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(postsRepository.getAllPost())
})
postRouter.get('/:id', (req: Request, res: Response) => {
    const isFind = postsRepository.findPostByID(req.params.id)
    if (!isFind) res.sendStatus(404)
        res.status(200).send(isFind)
})
postRouter.post('/', authorizationMiddleware, postValidationMiddleware, inputValidationMiddleware, (req: Request, res: Response) => {
    const newPost = postsRepository.createNewPost(req.body)
    if(!newPost) res.sendStatus(400)
    res.status(201).send(newPost)
})
postRouter.put('/:id', authorizationMiddleware, postValidationMiddleware, inputValidationMiddleware, (req: Request, res: Response) => {
    const isUpdate = postsRepository.updatePostByID(req.params.id, req.body)
    if(!isUpdate) res.sendStatus(404)
    res.sendStatus(204)
})
postRouter.delete('/:id', authorizationMiddleware, (req: Request, res: Response) => {
    const isDelete = postsRepository.deletePostByID(req.params.id)
    if(!isDelete) res.sendStatus(404)
    res.sendStatus(204)
})
