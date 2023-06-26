import {PostModel} from "../../models/posts-models/PostModel";
import {PostViewModel} from "../../models/posts-models/PostViewModel";
import {WithId} from "mongodb";

export const mapPosts = (post: WithId<PostModel> ) : PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}