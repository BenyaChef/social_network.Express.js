import {blogsDB} from "../db/blogsDB";
import {BlogViewModel} from "../models/blogs-models/BlogViewModel";
import {createNewId} from "../utils/helpers/create-new-id";
import {CreateBlogModel} from "../models/blogs-models/CreateBlogModel";
import {BlogModel} from "../models/blogs-models/BlogModel";
import {UpdateBlogModel} from "../models/blogs-models/UpdateBlogModel";
import {client} from "./db";
import {WithId} from "mongodb";


export const blogsRepository = {

    async getAllBlogs(): Promise<BlogViewModel[]> {
        return await client.db('blogs-and-posts').collection<BlogViewModel>('blogs').find({}, {projection: {_id: 0}}).toArray()
    },

   async findBlogByID(id: string): Promise<BlogViewModel[]> {
        return await client.db('blogs-and-posts').collection<BlogViewModel>('blogs').find({id: id}, {projection: {_id: 0}}).toArray()
    },

    async createNewBlog(body: CreateBlogModel): Promise<BlogViewModel> {
        const newBlog: CreateBlogModel = {
            id: createNewId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        await client.db('blogs-and-posts').collection('blogs').insertOne(newBlog)
        return newBlog;
    },

    updateBlogByID(id: string, body: UpdateBlogModel): boolean {
        const foundBlog: BlogModel | undefined = blogsDB.find(b => b.id === id)
        if (foundBlog) {
            foundBlog.name = body.name
            foundBlog.description = body.description
            foundBlog.websiteUrl = body.websiteUrl
            return true;
        }
        return false;
    },

    deleteBlogByID(id: string): boolean {
        for (let i = 0; i < blogsDB.length; i++) {
            if (blogsDB[i].id === id) {
                blogsDB.splice(i, 1)
                return true
            }
        }
        return false
    }
}