import "reflect-metadata";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {EmailsModel, UsersModel} from "../db/db";
import {DeleteResult, ObjectId} from "mongodb";
import {UsersDbModel} from "../models/users-model/users-db-model";
import {ResultCodeHandler} from "../models/result-code-handler";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {CodeConfirmModel} from "../models/users-model/code-confirm-model";
import {EmailConfirmationModel} from "../models/email-model.ts/email-confirmation-model";
import add from "date-fns/add";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {

    async recoveryPassword(id: ObjectId, codeRecovery: string): Promise<boolean> {
        const recoveryInfo = {
            code: codeRecovery,
            exp: add(new Date(), {minutes: 5})
        }
        const updateResult = await UsersModel.updateOne({_id: new ObjectId(id)}, {$set: recoveryInfo})
        return updateResult.matchedCount === 1
    }

    async resendingEmail(newConfirmationData: EmailConfirmationModel) : Promise<boolean> {
        const resultUpdateConfirmData = await EmailsModel.updateOne({email: newConfirmationData.email}, {$set: newConfirmationData})
        return resultUpdateConfirmData.acknowledged
    }

    async confirmUser(body: CodeConfirmModel): Promise<ResultCodeHandler<null>> {
        const findUserEmailByCod = await EmailsModel.findOne({confirmationCode: body.code})
        if(!findUserEmailByCod) {
            return resultCodeMap(false, null, Errors.Code_No_Valid)
        }
        if(findUserEmailByCod.isConfirmed) {
            return resultCodeMap(false, null, Errors.Is_Confirmed)
        }
        if(findUserEmailByCod.expirationDate < new Date()) {
            return resultCodeMap(false, null, Errors.Expiration_Date)
        }
        await EmailsModel.updateOne({email: findUserEmailByCod.email}, {$unset: {expirationDate: 1, confirmationCode: 1},  $set:{isConfirmed: true}})
        return resultCodeMap(true, null)
    }

    async findUserById(id: ObjectId): Promise<string | null> {
        const findUser = await UsersModel.findOne({_id: id})
        if (!findUser) return null
        return findUser.login
    }

    async createUser(newUser: AdminDbModel | UsersDbModel): Promise<ObjectId> {
        if('emailConfirmation' in newUser) {
            const createResult = await UsersModel.create(newUser.accountData)
            await EmailsModel.create(newUser.emailConfirmation)
            return createResult.id
        }
        const createResult = await UsersModel.create(newUser)
        return createResult.id
    }

    async deleteUsersById(id: string): Promise<boolean> {
        const findUser = await UsersModel.findOne({_id: new ObjectId(id)})
        if(!findUser) {
            return false
        }
        await EmailsModel.deleteOne({email: findUser.email})
        const isDelete: DeleteResult = await UsersModel.deleteOne({_id: new ObjectId(id)})
        return isDelete.deletedCount === 1
    }

    async updatePassword(id: ObjectId, newPasswordHash: string) {
        const resultUpdate = await UsersModel.updateOne({_id: new ObjectId(id)}, {$unset:{code: 1, exp: 1}, $set: {password: newPasswordHash}})
        return resultUpdate.matchedCount === 1
    }
}

