import {ObjectId} from "mongodb";

export interface CreateBlogModel {
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}