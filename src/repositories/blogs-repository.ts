import {BlogViewModel} from "../models/blogs-models/blog-view-model";
import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {BlogModel} from "../models/blogs-models/blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {blogsCollections} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {mapBlogs} from "../utils/helpers/map-blogs";

export const blogsRepository = {

    async createNewBlog(newBlog: CreateBlogModel): Promise<ObjectId> {
        await blogsCollections.insertOne(newBlog)
        return newBlog._id
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