import {BlogViewModel} from "../models/blogs-models/blog-view-model";
import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {ObjectId} from "mongodb";

import {blogsRepository} from "../repositories/blogs-repository";

export const blogsService = {

    async findBlogByID(id: string): Promise<BlogViewModel | null> {
        return await blogsRepository.findBlogByID(id)
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
        return await blogsRepository.createNewBlog(newBlog)

    },

    async updateBlogByID(id: string, body: UpdateBlogModel): Promise<boolean> {
        const updateBlog: UpdateBlogModel = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        return await blogsRepository.updateBlogByID(id, updateBlog)
    },

    async deleteBlogByID(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogByID(id)
    }
}