import {AdminDbModel} from "../models/users-model/admin-db-model";
import {emailCollections, usersCollections} from "../db/db";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {DeleteResult, ObjectId} from "mongodb";
import {UserInputModel} from "../models/users-model/user-input-model";
import {UsersDbModel} from "../models/users-model/users-db-model";
import {ResultCodeHandler} from "../models/result-code-handler";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {CodeConfirmModel} from "../models/users-model/code-confirm-model";
import {EmailConfirmationModel} from "../models/email-model.ts/email-confirmation-model";

export const usersRepository = {

    async resendingEmail(newConfirmationData: EmailConfirmationModel) : Promise<boolean> {
        const resultUpdateConfirmData = await emailCollections.updateOne({email: newConfirmationData.email}, {$set: newConfirmationData})
        return resultUpdateConfirmData.matchedCount === 1
    },

    async confirmUser(body: CodeConfirmModel): Promise<ResultCodeHandler<null>> {
        const findUserEmailByCod = await emailCollections.findOne({confirmationCode: body.code})
        if(!findUserEmailByCod) {
            return resultCodeMap(false, null, Errors.Code_No_Valid)
        }
        if(findUserEmailByCod.isConfirmed) {
            return resultCodeMap(false, null, Errors.Is_Confirmed)
        }
        if(findUserEmailByCod.expirationDate < new Date()) {
            return resultCodeMap(false, null, Errors.Expiration_Date)
        }
        await emailCollections.updateOne({email: findUserEmailByCod.email}, {$unset: {expirationDate: 1, confirmationCode: 1},  $set:{isConfirmed: true}})
        return resultCodeMap(true, null)
    },

    async findUserById(id: ObjectId): Promise<ObjectId | null> {
        const findUser = await usersCollections.findOne({_id: id})
        if (!findUser) return null
        return findUser._id
    },

    async findUserLoginOrEmail(body: LoginInputModel | UserInputModel): Promise<AdminDbModel | null> {
        let filter = {}
        if ('loginOrEmail' in body) {
            filter = {$or: [{login: body.loginOrEmail}, {email: body.loginOrEmail}]}
        } else {
            filter = {$or: [{login: body.login}, {email: body.email}]}
        }
        return await usersCollections.findOne(filter)
    },

    async createUser(newUser: AdminDbModel | UsersDbModel): Promise<ObjectId> {
        if('emailConfirmation' in newUser) {
            const createResult = await usersCollections.insertOne(newUser.accountData)
            await emailCollections.insertOne(newUser.emailConfirmation)
            return createResult.insertedId
        }
        const createResult = await usersCollections.insertOne(newUser)
        return createResult.insertedId
    },

    async deleteUsersById(id: string): Promise<boolean> {
        const findUser = await usersCollections.findOne({_id: new ObjectId(id)})
        if(!findUser) {
            return false
        }
        await emailCollections.deleteOne({email: findUser.email})
        const isDelete: DeleteResult = await usersCollections.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }
}