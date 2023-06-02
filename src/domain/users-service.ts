import {UserInputModel} from "../models/users-model/user-input-model";
import bcrypt from 'bcrypt'
import {UsersDBModel} from "../models/users-model/users-db-model";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {LoginInputModel} from "../models/login-models/login-input-model";

export const usersService = {

    async createUser(body: UserInputModel): Promise<ObjectId> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(body.password, passwordSalt)

        const newUser: UsersDBModel = {
            _id: new ObjectId(),
            login: body.login,
            email: body.email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(newUser)

    },

    async checkCredentials(body: LoginInputModel): Promise<UsersDBModel | null> {
        const user: UsersDBModel | null = await usersRepository.findUserLoginOrEmail(body)
        if (!user) return null
        const encodingUser = await bcrypt.compare(body.password, user.password)
        if(!encodingUser) return null
        return user
    },


   async deleteUsersById(id: string) : Promise<boolean> {
        return await usersRepository.deleteUsersById(id)
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}