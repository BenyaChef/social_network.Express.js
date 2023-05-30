import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {BlogModel} from "../models/blogs-models/blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {blogsCollections} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";


export const blogsRepository = {

    async createNewBlog(newBlog: CreateBlogModel): Promise<ObjectId> {
        const insertedResult = await blogsCollections.insertOne(newBlog)
        return insertedResult.insertedId
    },

    async updateBlogByID(id: string, updateBlog: UpdateBlogModel): Promise<boolean> {
        const isFind: UpdateResult<BlogModel> = await blogsCollections.updateOne({_id: new ObjectId(id)}, {$set: updateBlog})
        return isFind.matchedCount !== 1


    },

    async deleteBlogByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}