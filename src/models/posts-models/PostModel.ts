import {LikeModel} from "../comment-models/like-model";

export interface PostModel {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | undefined,
    createdAt: string,
    likes: LikeModel[]
}