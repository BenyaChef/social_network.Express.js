import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {ObjectId} from "mongodb";
import {postsRepository} from "../repositories/posts-repository";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {ResultCodeHandler} from "../models/result-code-handler";
import {Errors} from "../enum/errors";
import {resultCodeMap} from "../utils/helpers/result-code";
import {PostsClass} from "../classes/posts-class";

class PostsService {
    async createNewPost(body: CreatePostModel): Promise<ResultCodeHandler<ObjectId | null>> {
        const blog = await blogsQueryRepository.findBlogByID(body.blogId);
        if (!blog) {
            return resultCodeMap(false, null, Errors.Bad_Request)
        }
        const newPost: PostsClass = new PostsClass(body.title, body.shortDescription, body.content, blog.id, blog.name)
        const newPostId = await postsRepository.createNewPost(newPost)
        return resultCodeMap(true, newPostId)
    }

    async createNewPostForBlog(blogId: string, body: CreatePostModel): Promise<ResultCodeHandler<ObjectId | null>> {
        const blog = await blogsQueryRepository.findBlogByID(blogId);
        if (!blog) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        const newPostForBlog: PostsClass = new PostsClass(body.title, body.shortDescription, body.content, blog.id, blog.name)
        const newPostId = await postsRepository.createNewPost(newPostForBlog)
        return resultCodeMap(true, newPostId)
    }

    async updatePostByID(id: string, body: UpdatePostModel): Promise<ResultCodeHandler<ObjectId | null>> {
        const blog = await blogsQueryRepository.findBlogByID(body.blogId);
        if (!blog) {
            return resultCodeMap(false, null, Errors.Bad_Request)
        }
        const updatePost = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog.name
        }
        const isUpdate = await postsRepository.updatePostByID(id, updatePost)
        if (!isUpdate) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    }

    async deletePostByID(id: string): Promise<ResultCodeHandler<null>> {
        const idDelete = await postsRepository.deletePostByID(id)
        if (!idDelete) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    }
}

export const postsService = new PostsService()