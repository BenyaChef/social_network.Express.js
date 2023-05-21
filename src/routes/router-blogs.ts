import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {blogValidationMiddleware} from "../middlewares/blog-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {idInputMiddleware} from "../middlewares/id-input-middleware";
import {blogsController} from "../controller/blogs-controller";
import {postQueryValidationMiddleware} from "../middlewares/post-query-validation";
import {idQueryInputMiddleware} from "../middlewares/id-query-input";
import {idQueryValidationMiddleware} from "../middlewares/id-query-valodation";


export const blogRouter = Router({})

blogRouter.get('/', blogsController.getAllBlogs)

blogRouter.get('/:id',
    idValidationMiddleware,
    idInputMiddleware,
    blogsController.findBlogById)


blogRouter.get('/:id/posts/',

    blogsController.getAllPostsForBlog)

blogRouter.post('/:id/posts/',
    authorizationMiddleware,
    idQueryValidationMiddleware,
    idInputMiddleware,
    postQueryValidationMiddleware,
    inputValidationMiddleware,
    blogsController.createNewPostForBlog)

blogRouter.post('/',
    authorizationMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    blogsController.createNewBlog)

blogRouter.put('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    blogsController.updateBlogByID)

blogRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    blogsController.deleteBlogByID)
