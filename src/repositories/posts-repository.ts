import "reflect-metadata";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {PostModel} from "../models/posts-models/PostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";
import {PostsModel} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {injectable} from "inversify";
import {LikeModel} from "../models/comment-models/like-model";

@injectable()
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

    async findPost(postId: string) {
        return PostsModel.findById(new ObjectId(postId))
    }

    async saveLike(postId: string, newLike: LikeModel) {
        const saveResult = await PostsModel.updateOne({_id: postId}, {$push: {likes: newLike}})
        return saveResult.modifiedCount === 1
    }

    async updateLike(updateLike: LikeModel, userId: ObjectId, postId: string) {
        const post = await PostsModel.findById(new ObjectId(postId))
        const likeIndex = post!.likes.findIndex(like => like.userId.equals(new ObjectId(userId)))
        post!.likes[likeIndex] = updateLike
        const result = await post!.save()
        return result.id
    }
}


