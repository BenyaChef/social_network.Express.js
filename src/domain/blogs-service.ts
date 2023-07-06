import "reflect-metadata";
import {CreateBlogModel} from "../models/blogs-models/create-blog-model";
import {UpdateBlogModel} from "../models/blogs-models/update-blog-model";
import {BlogsRepository} from "../repositories/blogs-repository";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {resultCodeMap} from "../utils/helpers/result-code";
import {BlogsClass} from "../classes/blogs-class";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }
    async createNewBlog(body: CreateBlogModel): Promise<string> {

        const newBlog: BlogsClass = new BlogsClass(body.name, body.description, body.websiteUrl)

        return this.blogsRepository.createNewBlog(newBlog)
    }

    async updateBlogByID(id: string, body: UpdateBlogModel): Promise<ResultCodeHandler<null>> {
            const updateBlog: UpdateBlogModel = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        const newBlog = await this.blogsRepository.updateBlogByID(id, updateBlog)
        if(!newBlog) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    }

    async deleteBlogByID(id: string): Promise<ResultCodeHandler<null>> {
        const isDelete = await this.blogsRepository.deleteBlogByID(id)
        if(!isDelete) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        return resultCodeMap(true, null)
    }
}

