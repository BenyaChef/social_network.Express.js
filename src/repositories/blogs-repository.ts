import {blogsDB} from "../db/blogsDB";
import {BlogViewModel} from "../models/blogs-models/BlogViewModel";
import {createNewId} from "../utils/helpers/create-new-id";
import {CreateBlogModel} from "../models/blogs-models/CreateBlogModel";
import {BlogModel} from "../models/blogs-models/BlogModel";
import {UpdateBlogModel} from "../models/blogs-models/UpdateBlogModel";


export const blogsRepository = {

    getAllBlogs(): BlogViewModel[] {
        return blogsDB
    },

    findBlogByID(id: string): BlogViewModel | undefined{
        return blogsDB.find(b => b.id === id)
    },

    createNewBlog(body: CreateBlogModel): BlogViewModel {
        const newBlog: CreateBlogModel = {
            id: createNewId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        blogsDB.push(newBlog)
        return newBlog;
    },

    updateBlogByID(id: string, body: UpdateBlogModel): boolean {
        const foundBlog: BlogModel | undefined = blogsDB.find(b => b.id === id)
        if (foundBlog) {
            foundBlog.name = body.name
            foundBlog.description = body.description
            foundBlog.websiteUrl = body.websiteUrl
            return true;
        }
        return false;
    },

    deleteBlogByID(id: string): boolean {
        for (let i = 0; i < blogsDB.length; i++) {
            if (blogsDB[i].id === id) {
                blogsDB.splice(i, 1)
                return true
            }
        }
        return false
    }
}