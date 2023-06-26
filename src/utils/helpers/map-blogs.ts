import {BlogModel} from "../../models/blogs-models/blog-model";
import {BlogViewModel} from "../../models/blogs-models/blog-view-model";


export const mapBlogs = (blog: BlogModel): BlogViewModel => {
    return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt
    }
}