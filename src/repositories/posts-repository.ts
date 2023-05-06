import {postDB} from "../db/postDB";
import {PostTypeModel} from "../models/postTypeModel";
import {createNewId} from "../create-new-id";
import {findBlogID} from "../find-blogID";
import {param} from "express-validator";
import {blogsDB} from "../db/blogsDB";

export const postsRepository = {

    getAllPost() {
        return postDB
    },

    findPostByID(id: string) {
        return postDB.find(p => p.id === id)
    },

    createNewPost(body: PostTypeModel) {
        const newPost: PostTypeModel = {
            id: createNewId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: findBlogID(body.blogId)
        }
        postDB.push(newPost)
        return newPost
    },

    updatePostByID(id: string, body: PostTypeModel) {
        const findPost = postDB.find(p => p.id === id)
        if(findPost) {
            findPost.title = body.title
            findPost.shortDescription = body.shortDescription
            findPost.content = body.content
            findPost.blogId = body.blogId
            findPost.blogName = findBlogID(body.blogId)
            return true;
        }
        return false;
    },

    deletePostByID(id: string) {
        for (let i = 0; i < postDB.length; i++) {
            if (postDB[i].id === id) {
                postDB.splice(i, 1)
                return true
            }
        }
        return false
    }
}