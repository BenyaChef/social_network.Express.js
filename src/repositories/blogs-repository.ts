import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {BlogModel} from "../models/blogs-models/blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {blogsCollections} from "../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";


export const blogsRepository = {

    async createNewBlog(newBlog: CreateBlogModel): Promise<ObjectId | boolean> {
        try {
            const insertedResult: InsertOneResult = await blogsCollections.insertOne(newBlog)
            return insertedResult.insertedId
        } catch (e) {
            return false
        }
    },

    async updateBlogByID(id: string, updateBlog: UpdateBlogModel): Promise<boolean> {
        try {
            const isFind: UpdateResult<BlogModel> = await blogsCollections.updateOne({_id: new ObjectId(id)}, {$set: updateBlog})
            return isFind.matchedCount === 1;
        } catch (e) {
            return false
        }
    },

    async deleteBlogByID(id: string): Promise<boolean> {
        try {
            const isDelete: DeleteResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
            return isDelete.deletedCount === 1
        } catch (e) {
            return false
        }
    }
}