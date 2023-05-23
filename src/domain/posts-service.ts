import {PostViewModel} from "../models/posts-models/PostViewModel";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {ObjectId} from "mongodb";
import {findBlogNameByID} from "../utils/helpers/find-blogID";
import {postsRepository} from "../repositories/posts-repository";

export const postsService = {

    async findPostByID(id: string): Promise<PostViewModel | boolean> {
        return await postsRepository.findPostByID(id)
    },

    async createNewPost(body: CreatePostModel): Promise<PostViewModel | boolean> {
        const newPost: CreatePostModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: await findBlogNameByID(body.blogId),
            createdAt: new Date().toISOString()
        }
        return await postsRepository.createNewPost(newPost)
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