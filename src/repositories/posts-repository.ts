import {PostViewModel} from "../models/posts-models/PostViewModel";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {PostModel} from "../models/posts-models/PostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {postsCollections} from "../db/db";
import {mapPosts} from "../utils/helpers/map-posts";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";


export const postsRepository = {

    async findPostByID(id: string): Promise<PostViewModel | boolean> {
        const isFind: PostModel | null = await postsCollections.findOne({_id: new ObjectId(id)})
        if (!isFind) return false
        return mapPosts(isFind)
    },

    async createNewPost(newPost: CreatePostModel): Promise<PostViewModel> {
        await postsCollections.insertOne(newPost)
        return mapPosts(newPost)
    },

    async updatePostByID(id: string, updatePost: UpdatePostModel): Promise<boolean> {
        const findPost: UpdateResult<PostModel> = await postsCollections.updateOne({_id: new ObjectId(id)}, {$set: updatePost})
        return findPost.matchedCount === 1
    },

    async deletePostByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await postsCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}