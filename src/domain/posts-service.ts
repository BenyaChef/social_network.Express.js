import {PostViewModel} from "../models/posts-models/PostViewModel";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {ObjectId} from "mongodb";
import {findBlogNameByID} from "../utils/helpers/find-blog-name-by-ID";
import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";

export enum ResultCode {
    Success,
    NotFound,
    ServerError
}

type Result<T> = {
    data: T | null
    code: ResultCode
    errorMessage: string | null
}

class NotFoundDomainError extends Error {
    constructor(message: string) {
        super(message);
    }
}

const controller = () => {
    try {
        //flow
    } catch (e) {
        if(e instanceof NotFoundDomainError) res.status(400)
    }
}

export const postsService = {

    async findPostByID(id: string): Promise<PostViewModel | null> {
        return await postsRepository.findPostByID(id)
    },

    async createNewPost(body: CreatePostModel): Promise<Result<PostViewModel>> {
        const blog = await blogsRepository.findBlogByID(body.blogId);

        if(!blog) {
            throw new NotFoundDomainError('blog not found')
        }

        const newPost: CreatePostModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        const result = await postsRepository.createNewPost(newPost)

        if (!result) {
            return {
                code: ResultCode.ServerError,
                data: null,
                errorMessage: null
            }
        }

        return {
            code: ResultCode.Success,
            data: result,
            errorMessage: null
        }
    },

    async createNewPostForBlog(blogId: string ,body: CreatePostModel) : Promise<PostViewModel> {
        const newPostForBlog: CreatePostModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
            blogName: await findBlogNameByID(blogId),
            createdAt: new Date().toISOString()
        }
        return await postsRepository.createNewPost(newPostForBlog)
    },

    async updatePostByID(id: string, body: UpdatePostModel): Promise<boolean> {
        const updatePost = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: await findBlogNameByID(body.blogId)
        }

        return await postsRepository.updatePostByID(id, updatePost)
    },

    async deletePostByID(id: string): Promise<boolean> {
        return await postsRepository.deletePostByID(id)
    }
}