import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../repositories/posts-repository";
import {BlogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {ResultCodeHandler} from "../models/result-code-handler";
import {Errors} from "../enum/errors";
import {resultCodeMap} from "../utils/helpers/result-code";
import {PostsClass} from "../classes/posts-class";

export class PostsService {
    constructor(protected postsRepository: PostsRepository,
                protected blogsQueryRepository: BlogsQueryRepository) {
    }
    async createNewPost(body: CreatePostModel): Promise<ResultCodeHandler<ObjectId | null>> {
        const blog = await this.blogsQueryRepository.findBlogByID(body.blogId);
        if (!blog) {
            return resultCodeMap(false, null, Errors.Bad_Request)
        }
        const newPost: PostsClass = new PostsClass(body.title, body.shortDescription, body.content, blog.id, blog.name)
        const newPostId = await this.postsRepository.createNewPost(newPost)
        return resultCodeMap(true, newPostId)
    }

    async createNewPostForBlog(blogId: string, body: CreatePostModel): Promise<ResultCodeHandler<ObjectId | null>> {
        const blog = await this.blogsQueryRepository.findBlogByID(blogId);
        if (!blog) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        const newPostForBlog: PostsClass = new PostsClass(body.title, body.shortDescription, body.content, blog.id, blog.name)
        const newPostId = await this.postsRepository.createNewPost(newPostForBlog)
        return resultCodeMap(true, newPostId)
    }

    async updatePostByID(id: string, body: UpdatePostModel): Promise<ResultCodeHandler<ObjectId | null>> {
        const blog = await this.blogsQueryRepository.findBlogByID(body.blogId);
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
        const isUpdate = await this.postsRepository.updatePostByID(id, updatePost)
        if (!isUpdate) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    }

    async deletePostByID(id: string): Promise<ResultCodeHandler<null>> {
        const idDelete = await this.postsRepository.deletePostByID(id)
        if (!idDelete) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    }
}
