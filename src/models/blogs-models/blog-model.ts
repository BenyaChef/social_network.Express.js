import {ObjectId} from "mongodb";

export interface BlogModel {
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}