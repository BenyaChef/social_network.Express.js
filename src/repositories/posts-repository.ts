import {PostViewModel} from "../models/posts-models/PostViewModel";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {PostModel} from "../models/posts-models/PostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {blogsCollections, postsCollections} from "./db";
import {mapPosts} from "../mapPosts";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {findBlogID} from "../utils/helpers/find-blogID";

export const postsRepository = {

    async getAllPost(): Promise<PostViewModel[]> {
        const postsArr: PostModel[] = await postsCollections.find({}).toArray()
        return postsArr.map(post => mapPosts(post))
    },

    async findPostByID(id: string): Promise<PostViewModel | boolean> {
        const isFind: PostModel | null = await postsCollections.findOne({_id: new ObjectId(id)})
        if (!isFind) return false
        return mapPosts(isFind)
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
        await postsCollections.insertOne(newPost)
        return mapPosts(newPost)
    },

    async updatePostByID(id: string, body: UpdatePostModel): Promise<boolean> {
        const findPost: UpdateResult<PostModel> = await postsCollections.updateOne({_id: new ObjectId(id)},
            {
                $set:
                    {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content,
                        blogId: body.blogId,
                        blogName: await findBlogID(body.blogId)
                    }
            })
        return findPost.matchedCount === 1
    },

    async deletePostByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await postsCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1

    }
}