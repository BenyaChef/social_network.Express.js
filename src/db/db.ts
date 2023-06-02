import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import {BlogModel} from "../models/blogs-models/blog-model";
import {PostModel} from "../models/posts-models/PostModel";
import {UsersDBModel} from "../models/users-model/users-db-model";
import {settings} from "../../settings";
dotenv.config()

const mongoURI = settings.MONGO_URI

const client = new MongoClient(mongoURI)
const DB = client.db()
export const blogsCollections = DB.collection<BlogModel>('blogs')
export const postsCollections = DB.collection<PostModel>('posts')
export const usersCollections = DB.collection<UsersDBModel>('users')
export const commentCollections = DB.collection('comments')

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