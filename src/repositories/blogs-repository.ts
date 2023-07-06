import "reflect-metadata";
import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {BlogsModel} from "../db/db";
import {DeleteResult, ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async createNewBlog(newBlog: CreateBlogModel): Promise<string> {
        const insertedResult = await BlogsModel.create(newBlog)
        return insertedResult.id
    }

    async updateBlogByID(id: string, updateBlog: UpdateBlogModel): Promise<boolean> {
        const updateResult = await BlogsModel.updateOne({_id: new ObjectId(id)}, {$set: updateBlog})
        return updateResult.matchedCount === 1
    }

    async deleteBlogByID(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await BlogsModel.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}
