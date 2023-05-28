import {PostViewModel} from "../models/posts-models/PostViewModel";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {ObjectId} from "mongodb";
import {findBlogNameByID} from "../utils/helpers/find-blog-name-by-ID";
import {postsRepository} from "../repositories/posts-repository";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {ResultCodeHandler} from "../models/result-code-handler";
import {Errors} from "../enum/errors";
import {resultCodeMap} from "../utils/helpers/result-code";

export const postsService = {

    async createNewPost(body: CreatePostModel): Promise<ResultCodeHandler<ObjectId>> {
        const blog = await blogsQueryRepository.findBlogByID(body.blogId);
        if (!blog) {
            return resultCodeMap(false, null, Errors.Not_Found)
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
        const newPostId = await postsRepository.createNewPost(newPost)
        if (!newPostId) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, newPostId)
    },

    async createNewPostForBlog(blogId: string, body: CreatePostModel): Promise<PostViewModel> {
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