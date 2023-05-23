import {UsersDBModel} from "../models/users-model/users-db-model";
import {usersCollections} from "../db/db";
import {UserViewModel} from "../models/users-model/user-view-model";
import {mapUsers} from "../utils/helpers/map-users";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {ObjectId} from "mongodb";

export const usersRepository = {

    async findUserLoginOrEmail(body: LoginInputModel): Promise<UsersDBModel | null> {
        return await usersCollections.findOne({$or: [{login: body.loginOrEmail}, {email: body.loginOrEmail}]})
    },

    async createUser(newUser: UsersDBModel): Promise<UserViewModel> {
        await usersCollections.insertOne(newUser)
        return mapUsers(newUser)
    },

    async deleteUsersById(id: string): Promise<boolean> {
        const isDelete = await usersCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}