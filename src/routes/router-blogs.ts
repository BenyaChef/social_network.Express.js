import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {blogValidationMiddleware} from "../middlewares/blog-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {idInputMiddleware} from "../middlewares/id-input-middleware";
import {blogsController} from "../controller/blogs-controller";
import {postValidationMiddleware} from "../middlewares/post-validation-middleware";


const [title, shortDescription, content] = postValidationMiddleware
const validationCreatePostForBlog = [title, shortDescription, content]

export const blogRouter = Router({})

blogRouter.get('/', blogsController.getAllBlogs)

blogRouter.get('/:id',
    idValidationMiddleware,
    idInputMiddleware,
    blogsController.findBlogById)


blogRouter.get('/:blogId/posts/',
    blogsController.getAllPostsForBlog)

blogRouter.post('/:id/posts/',
    authorizationMiddleware,
    idValidationMiddleware,
    idInputMiddleware,
    validationCreatePostForBlog,
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
