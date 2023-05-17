import {BlogViewModel} from "../models/blogs-models/BlogViewModel";
import {CreateBlogModel} from "../models/blogs-models/CreateBlogModel";
import {BlogModel} from "../models/blogs-models/BlogModel";
import {UpdateBlogModel} from "../models/blogs-models/UpdateBlogModel";
import {blogsCollections} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {mapBlogs} from "../utils/helpers/map-blogs";

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

    async createNewBlog(newBlog: CreateBlogModel): Promise<BlogViewModel> {
        await blogsCollections.insertOne(newBlog)
        return mapBlogs(newBlog)
    },

    async updateBlogByID(id: string, updateBlog: UpdateBlogModel): Promise<boolean> {
        const isFind: UpdateResult<BlogModel> = await blogsCollections.updateOne({_id: new ObjectId(id)}, {$set: updateBlog})
        return isFind.matchedCount === 1;
    },

    async deleteBlogByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}