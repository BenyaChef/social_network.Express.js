import {ObjectId} from "mongodb";

export interface PostModel {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | undefined,
    createdAt: string
}