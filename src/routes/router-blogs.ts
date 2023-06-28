import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {blogValidationMiddleware, postByBlogValidationMiddleware} from "../middlewares/validation-middlewares";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {idValidationMiddleware} from "../middlewares/id-validation-middleware";
import {blogsController} from "../composition-root";



export const blogRouter = Router({})

blogRouter.get('/', blogsController.getAllBlogs.bind(blogsController))

blogRouter.get('/:id',
    idValidationMiddleware,
    blogsController.findBlogById.bind(blogsController))


blogRouter.get('/:id/posts/',
    idValidationMiddleware,
    blogsController.getAllPostsForBlog.bind(blogsController))

blogRouter.post('/:id/posts/',
    authorizationMiddleware,
    idValidationMiddleware,
    postByBlogValidationMiddleware,
    inputValidationMiddleware,
    blogsController.createNewPostForBlog.bind(blogsController))

blogRouter.post('/',
    authorizationMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    blogsController.createNewBlog.bind(blogsController))

blogRouter.put('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    blogsController.updateBlogByID.bind(blogsController))

blogRouter.delete('/:id',
    authorizationMiddleware,
    idValidationMiddleware,
    blogsController.deleteBlogByID.bind(blogsController))
