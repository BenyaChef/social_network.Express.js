import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {BlogModel} from "../models/blogs-models/blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {blogsCollections, BlogsModel} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";


export const blogsRepository = {

    async createNewBlog(newBlog: CreateBlogModel): Promise<string> {
        const insertedResult = await BlogsModel.create(newBlog)
        return insertedResult.id
    },

    async updateBlogByID(id: string, updateBlog: UpdateBlogModel): Promise<boolean> {
        const updateResult: UpdateResult<BlogModel> = await blogsCollections.updateOne({_id: new ObjectId(id)}, {$set: updateBlog})
        return updateResult.matchedCount === 1


    },

    async deleteBlogByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}