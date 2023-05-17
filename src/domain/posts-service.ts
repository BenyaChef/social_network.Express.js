import {PostViewModel} from "../models/posts-models/PostViewModel";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {ObjectId} from "mongodb";
import {findBlogID} from "../utils/helpers/find-blogID";
import {postsRepository} from "../repositories/posts-repository";

export const postsService = {

    async getAllPost(): Promise<PostViewModel[]> {
        return await postsRepository.getAllPost()
    },

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
            blogName: await findBlogID(body.blogId),
            createdAt: new Date().toISOString()
        }
        return await postsRepository.createNewPost(newPost)
    },

    async updatePostByID(id: string, body: UpdatePostModel): Promise<boolean> {
        const updatePost = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: await findBlogID(body.blogId)
        }

        return await postsRepository.updatePostByID(id, updatePost)
    },

    async deletePostByID(id: string): Promise<boolean> {
        return await postsRepository.deletePostByID(id)
    }
}