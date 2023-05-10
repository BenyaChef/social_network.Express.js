import {postDB} from "../db/postDB";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {createNewId} from "../utils/helpers/create-new-id";
import {findBlogID} from "../utils/helpers/find-blogID";
import {CreatePostModel} from "../models/posts-models/CreatePostModel";
import {PostModel} from "../models/posts-models/PostModel";
import {UpdatePostModel} from "../models/posts-models/UpdatePostModel";

export const postsRepository = {

    getAllPost(): PostViewModel[] {
        return postDB
    },

    findPostByID(id: string): PostViewModel | undefined{
        return postDB.find(p => p.id === id)
    },

    createNewPost(body: CreatePostModel): PostViewModel {
        const newPost: PostModel = {
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

    updatePostByID(id: string, body: UpdatePostModel): boolean {
        const findPost: PostModel | undefined = postDB.find(p => p.id === id)
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

    deletePostByID(id: string): boolean {
        for (let i = 0; i < postDB.length; i++) {
            if (postDB[i].id === id) {
                postDB.splice(i, 1)
                return true
            }
        }
        return false
    }
}