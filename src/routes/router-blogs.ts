import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {blogValidationMiddleware, postByBlogValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {blogsController} from "../controller/blogs-controller";


export const blogRouter = Router({})

blogRouter.get('/', blogsController.getAllBlogs)

blogRouter.get('/:id',
    idValidationMiddleware,
    blogsController.findBlogById)


blogRouter.get('/:id/posts/',
    idValidationMiddleware,
    blogsController.getAllPostsForBlog)

blogRouter.post('/:id/posts/',
    authorizationMiddleware,
    idValidationMiddleware,
    postByBlogValidationMiddleware,
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
    blogValidationMiddleware,
    inputValidationMiddleware,
    blogsController.updateBlogByID)

blogRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    blogsController.deleteBlogByID)
