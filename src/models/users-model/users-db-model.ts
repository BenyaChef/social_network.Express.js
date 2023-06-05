import {ObjectId} from "mongodb";

export interface UsersDBModel {
    _id?: ObjectId
    email: string
    password: string
    login: string
    createdAt: string
    isConfirmed?: boolean
}