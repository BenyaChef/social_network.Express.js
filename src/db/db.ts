import dotenv from "dotenv";
import {BlogModel} from "../models/blogs-models/blog-model";
import {PostModel} from "../models/posts-models/PostModel";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {settings} from "../settings";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {EmailConfirmationModel} from "../models/email-model.ts/email-confirmation-model";
import {TypeRequestCount} from "../models/request-models/api-request-count-model";
import {DevicesDbModel} from "../models/divice-model/devices-db-model";
import mongoose from "mongoose";
import {BlogsSchema} from "./schemas/blogs-schema";
import {PostsSchema} from "./schemas/posts-schema";
import {UsersSchema} from "./schemas/users-schema";
import {EmailsConfirmSchema} from "./schemas/emails-confirm-schema";
import {CommentsSchema} from "./schemas/comments-schema";
import {DeviceSchema} from "./schemas/device-schema";
import {RequestCountSchema} from "./schemas/request-count-schema";
import {LikeModel} from "../models/comment-models/like-model";
import {LikesSchema} from "./schemas/likes-schema";

dotenv.config()

const mongoURI = settings.MONGO_URI

// const client = new MongoClient(mongoURI)
// const DB = client.db()

export const BlogsModel = mongoose.model<BlogModel>('blogs', BlogsSchema)
export const PostsModel = mongoose.model<PostModel>('posts', PostsSchema)
export const UsersModel = mongoose.model<AdminDbModel>('users', UsersSchema)
export const EmailsModel = mongoose.model<EmailConfirmationModel>('emails', EmailsConfirmSchema)
export const CommentsModel = mongoose.model<CommentDbModel>('comments', CommentsSchema)
export const DevicesModel = mongoose.model<DevicesDbModel>('auth_devices', DeviceSchema)
export const RequestCountsModel = mongoose.model<TypeRequestCount>('api_requests', RequestCountSchema)
export const LikesModel = mongoose.model<LikeModel>('likes-dislikes', LikesSchema)

// export const blogsCollections = DB.collection<BlogModel>('blogs')
// export const postsCollections = DB.collection<PostModel>('posts')
// export const usersCollections = DB.collection<AdminDbModel>('users')
// export const commentCollections = DB.collection<CommentDbModel>('comments')
// export const emailCollections = DB.collection<EmailConfirmationModel>('emails')
// export const requestsAPI = DB.collection<ApiRequestCountModel>('api_request')
// export const authDeviceCollections = DB.collection<DevicesDbModel>('auth_device')

export async function runDB() {
    try {
        await mongoose.connect(mongoURI)
        // await client.connect();
        // await DB.command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log("Can`t connect to db")
        await mongoose.disconnect()
        // await client.close();

    }
}