import {PostModel} from "../../models/posts-models/PostModel";
import {PostViewModel} from "../../models/posts-models/PostViewModel";
import {ObjectId, WithId} from "mongodb";
import {LikesStatus} from "../../enum/likes-status-enum";
import {newestLikesType} from "../../models/comment-models/like-model";


export const mapPosts = (post: WithId<PostModel>, userID: ObjectId | null): PostViewModel => {
    const myStatus = userID !== null ? post.likes.find(like => like.userId.equals(new ObjectId(userID))) : undefined
    const lastLikes = post.likes.filter(like => like.myStatus === LikesStatus.Like).slice(-3) .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    const likeCount = post.likes.filter(like => like.myStatus === LikesStatus.Like).length
    const dislikeCount = post.likes.filter(like => like.myStatus === LikesStatus.Dislike).length
    const newestLikes: newestLikesType[] = lastLikes.map((like) => {
        return {
            addedAt: like.addedAt,
            userId: like.userId,
            login: like.userName
        }
    })

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: likeCount,
            dislikesCount: dislikeCount,
            myStatus: myStatus?.myStatus || LikesStatus.None,
            newestLikes: newestLikes
        }
    }
}