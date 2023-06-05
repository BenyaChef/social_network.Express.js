import {UsersDBModel} from "../models/users-model/users-db-model";
import {usersCollections} from "../db/db";

import {LoginInputModel} from "../models/login-models/login-input-model";
import {DeleteResult, ObjectId} from "mongodb";
import {UserInputModel} from "../models/users-model/user-input-model";

export const usersRepository = {

    async findUserById(id: ObjectId): Promise<ObjectId | null> {
        const findUser = await usersCollections.findOne({_id: id})
        if (!findUser) return null
        return findUser._id
    },

    async findUserLoginOrEmail(body: LoginInputModel | UserInputModel): Promise<UsersDBModel | null> {
        let filter = {}
        if ('loginOrEmail' in body) {
            filter = {$or: [{login: body.loginOrEmail}, {email: body.loginOrEmail}]}
        } else {
            filter = {$or: [{login: body.login}, {email: body.email}]}
        }
        return await usersCollections.findOne(filter)
    },

    async createUser(newUser: UsersDBModel): Promise<ObjectId> {
        const createResult = await usersCollections.insertOne(newUser)
        return createResult.insertedId
    },

    async deleteUsersById(id: string): Promise<boolean> {
        const isDelete: DeleteResult = await usersCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}