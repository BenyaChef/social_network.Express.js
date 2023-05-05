import {blogsDB} from "../db/blogsDB";
import {TypeBlog} from "../models/blogsTypeModel";
import {createNewId} from "../create-new-id";


export const blogsRepository = {

    getAllBlogs() {
        return blogsDB
    },

    findBlogByID(id: string) {
        return blogsDB.find(b => b.id === id)
    },

    createNewBlog(body: TypeBlog) {
        const newBlog: TypeBlog = {
            id: createNewId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        blogsDB.push(newBlog)
        return newBlog;
    },

    updateBlogByID(id: string, body: TypeBlog) {
        const foundBlog = blogsDB.find(b => b.id === id)
        if (foundBlog) {
            foundBlog.name = body.name
            foundBlog.description = body.description
            foundBlog.websiteUrl = body.websiteUrl
            return true;
        }
        return false;
    },

    deleteBlogByID(id: string) {
        for (let i = 0; i < blogsDB.length; i++) {
            if (blogsDB[i].id === id) {
                blogsDB.splice(i, 1)
                return true
            }
        }
        return false
    }

}