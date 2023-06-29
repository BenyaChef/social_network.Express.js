import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {PostModel} from "../models/posts-models/PostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {PostsModel} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

export class PostsRepository {
    async createNewPost(newPost: CreatePostModel): Promise<ObjectId> {
        const result = await PostsModel.create(newPost)
        return result.id
    }

    async updatePostByID(id: string, updatePost: UpdatePostModel): Promise<boolean> {
        const findPost: UpdateResult<PostModel> = await PostsModel.updateOne({_id: new ObjectId(id)}, {$set: updatePost})
        return findPost.matchedCount === 1

    }

    async deletePostByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await PostsModel.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}


