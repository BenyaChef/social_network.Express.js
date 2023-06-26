import mongoose from "mongoose";
import {WithId} from "mongodb";
import {PostModel} from "../../models/posts-models/PostModel";

export const PostsSchema = new mongoose.Schema<WithId<PostModel>>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})