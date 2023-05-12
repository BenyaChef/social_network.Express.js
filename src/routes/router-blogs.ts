import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {blogValidationMiddleware} from "../middlewares/blog-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {BlogViewModel} from "../models/blogs-models/BlogViewModel";
import {CreateBlogModel} from "../models/blogs-models/CreateBlogModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../models/request-models/RequestTypes";
import {UpdateBlogModel} from "../models/blogs-models/UpdateBlogModel";
import {idValidationMiddleware} from "../middlewares/idValidationMiddleware";
import {idInputMiddleware} from "../middlewares/id-input-middleware";


export const blogRouter = Router({})

blogRouter.get('/', async (req: Request,
                           res: Response<BlogViewModel[]>) => {
    res.status(200).send(await blogsRepository.getAllBlogs())
})

blogRouter.get('/:id', idValidationMiddleware, idInputMiddleware, async (req: RequestWithParams<{ id: string }>,
                                                                                 res: Response<BlogViewModel | boolean>) => {
    const foundBlog: BlogViewModel | boolean = await blogsRepository.findBlogByID(req.params.id)
    if (!foundBlog) return res.sendStatus(404)
    return res.status(200).send(foundBlog)
})

blogRouter.post('/',
    authorizationMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithBody<CreateBlogModel>,
           res: Response<BlogViewModel>) => {
        const newBlog: BlogViewModel = await blogsRepository.createNewBlog(req.body)
        if (!newBlog) res.sendStatus(400)
        res.status(201).send(newBlog)
    })

blogRouter.put('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{ id: string }, UpdateBlogModel>,
           res: Response) => {
        const isUpdate = await blogsRepository.updateBlogByID(req.params.id, req.body)
        if (!isUpdate) return res.sendStatus(404)
        return res.sendStatus(204)
    })

blogRouter.delete('/:id',
    authorizationMiddleware,
    (req: RequestWithParams<{ id: string }>,
     res: Response) => {
        const isDeleted = blogsRepository.deleteBlogByID(req.params.id)
        if (!isDeleted) res.sendStatus(404)
        res.sendStatus(204)
    })
