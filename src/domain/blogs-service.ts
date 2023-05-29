import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {ObjectId} from "mongodb";

import {blogsRepository} from "../repositories/blogs-repository";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {resultCodeMap} from "../utils/helpers/result-code";

export const blogsService = {

    async createNewBlog(body: CreateBlogModel): Promise<ObjectId> {

        const newBlog: CreateBlogModel = {
            _id: new ObjectId,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()

        }
        return await blogsRepository.createNewBlog(newBlog)

    },

    async updateBlogByID(id: string, body: UpdateBlogModel): Promise<ResultCodeHandler<null>> {

        const updateBlog: UpdateBlogModel = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        const newBlog = await blogsRepository.updateBlogByID(id, updateBlog)
        if(!newBlog) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    },

    async deleteBlogByID(id: string): Promise<ResultCodeHandler<null>> {
        const isDelete = await blogsRepository.deleteBlogByID(id)
        if(!isDelete) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    }
}