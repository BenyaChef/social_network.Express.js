import {BlogViewModel} from "../models/blogs-models/BlogViewModel";
import {CreateBlogModel} from "../models/blogs-models/CreateBlogModel";
import {BlogModel} from "../models/blogs-models/BlogModel";
import {UpdateBlogModel} from "../models/blogs-models/UpdateBlogModel";
import {blogsCollections} from "./db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {mapBlogs} from "../mapBlogs";

export const blogsRepository = {

    async getAllBlogs(): Promise<BlogViewModel[]> {
        const arrBlogs: BlogModel[] = await blogsCollections.find({}).toArray()
        return arrBlogs.map(blog => mapBlogs(blog))
    },

    async findBlogByID(id: string): Promise<BlogViewModel | boolean> {
        const isFind: BlogModel | null = await blogsCollections.findOne({_id: new ObjectId(id)})
        if (!isFind) return false
        return mapBlogs(isFind);


    },

    async createNewBlog(body: CreateBlogModel): Promise<BlogViewModel> {
        const newBlog: CreateBlogModel = {
            _id: new ObjectId,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()

        }
        await blogsCollections.insertOne(newBlog)
        return mapBlogs(newBlog)
    },

    async updateBlogByID(id: string, body: UpdateBlogModel): Promise<boolean> {

        const isFind: UpdateResult<BlogModel> = await blogsCollections.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }
            })
        return isFind.matchedCount === 1;
    },

    async deleteBlogByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}