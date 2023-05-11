import {ObjectId} from "mongodb";

export interface BlogModel {
    _id: ObjectId,
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}