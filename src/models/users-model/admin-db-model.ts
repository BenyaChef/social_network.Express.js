import {ObjectId} from "mongodb";

export interface AdminDbModel {
    _id?: ObjectId
    email: string
    password: string
    login: string
    createdAt: string
}