import {blogsDB} from "./db/blogsDB";


export const findBlogID = (blog: string) => {
    const findBlog = blogsDB.find(e => e.id === blog)
    return findBlog?.name
}