import {ObjectId} from "mongodb";

export interface CreateBlogModel {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}