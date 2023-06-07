import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {BlogModel} from "../models/blogs-models/blog-model";
import {PostModel} from "../models/posts-models/PostModel";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {settings} from "../settings";
import {CommentDbModel} from "../models/comment-models/comment-db-model";
import {EmailConfirmationModel} from "../models/email-model.ts/email-confirmation-model";
dotenv.config()

const mongoURI = settings.MONGO_URI

const client = new MongoClient(mongoURI)
const DB = client.db()
export const blogsCollections = DB.collection<BlogModel>('blogs')
export const postsCollections = DB.collection<PostModel>('posts')
export const usersCollections = DB.collection<AdminDbModel>('users')
export const commentCollections = DB.collection<CommentDbModel>('comments')
export const emailCollections = DB.collection<EmailConfirmationModel>('emails')

export async function runDB() {
    try {
        await client.connect();
        await DB.command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log("Can`t connect to db")
        await client.close();
    }
}