import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {blogValidationMiddleware} from "../middlewares/blog-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {BlogViewModel} from "../models/blogs-models/BlogViewModel";
import {CreateBlogModel} from "../models/blogs-models/CreateBlogModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../models/request-models/RequestTypes";
import {UpdateBlogModel} from "../models/blogs-models/UpdateBlogModel";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {idInputMiddleware} from "../middlewares/id-input-middleware";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";


export const blogRouter = Router({})

blogRouter.get('/', async (req: Request,
                           res: Response<BlogViewModel[]>) => {
    res.status(HTTP_STATUS.OK).send(await blogsRepository.getAllBlogs())
})

blogRouter.get('/:id',
    idValidationMiddleware,
    idInputMiddleware,
    async (req: RequestWithParams<{ id: string }>,
           res: Response<BlogViewModel | boolean>) => {
        const foundBlog: BlogViewModel | boolean = await blogsRepository.findBlogByID(req.params.id)
        if (!foundBlog) return res.sendStatus(HTTP_STATUS.Not_found)
        return res.status(HTTP_STATUS.OK).send(foundBlog)
    })

blogRouter.post('/',
    authorizationMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    async (req: RequestWithBody<CreateBlogModel>,
           res: Response<BlogViewModel>) => {
        const newBlog: BlogViewModel | undefined = await blogsRepository.createNewBlog(req.body)
        if (!newBlog) res.sendStatus(HTTP_STATUS.Bad_request)
        res.status(HTTP_STATUS.Created).send(newBlog)
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
        if (!isUpdate) return res.sendStatus(HTTP_STATUS.Not_found)
        return res.sendStatus(HTTP_STATUS.No_content)
    })

blogRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
   async (req: RequestWithParams<{ id: string }>,
     res: Response) => {
        const isDeleted = await blogsRepository.deleteBlogByID(req.params.id)
        if (!isDeleted) return  res.sendStatus(HTTP_STATUS.Not_found)
        return  res.sendStatus(HTTP_STATUS.No_content)
    })
