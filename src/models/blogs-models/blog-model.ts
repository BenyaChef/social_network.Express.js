import {ObjectId} from "mongodb";

export interface BlogModel {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}