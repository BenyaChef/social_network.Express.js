import {BlogModel} from "./models/blogs-models/BlogModel";
import {BlogViewModel} from "./models/blogs-models/BlogViewModel";


export function mapBlogs(blog: BlogModel): BlogViewModel {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt
    }
}