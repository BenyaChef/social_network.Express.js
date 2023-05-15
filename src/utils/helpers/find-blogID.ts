import {blogsCollections} from "../../db/db";
import {ObjectId} from "mongodb";

export const findBlogID = async (blog: string) => {
    const findBlog = await blogsCollections.findOne({_id: new ObjectId(blog)})
    return findBlog!.name

}