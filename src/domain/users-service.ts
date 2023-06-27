import {UserInputModel} from "../models/users-model/user-input-model";
import bcrypt from 'bcrypt'
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {ObjectId, WithId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {emailAdapter} from "../adapters/email-adapter";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {generateHash} from "../utils/helpers/generate-hash";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {CodeConfirmModel} from "../models/users-model/code-confirm-model";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {EmailResending} from "../models/email-model.ts/email-confirmation-model";
import {RecoveryPasswordModel} from "../models/recovery-password-model/recovery-password-model";
import {AdminClass} from "../classes/admin-class";
import {EmailConfirmationClass} from "../classes/email-confirmation-class";
import {UsersDbModel} from "../models/users-model/users-db-model";


export const usersService = {

    async emailResending(body: EmailResending): Promise<ResultCodeHandler<null>> {
        const findConfirmationData = await usersQueryRepository.findUserEmail(body)

        if (!findConfirmationData) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if (findConfirmationData.isConfirmed) {
            return resultCodeMap(false, null, Errors.Is_Confirmed)
        }
        const newConfirmationData = {
            ...findConfirmationData,
            expirationDate: add(new Date(), {
                minutes: 5
            }),
            confirmationCode: uuidv4()
        }
        const result = await usersRepository.resendingEmail(newConfirmationData)

        if (!result) return resultCodeMap(false, null, Errors.Error_Server)

        try {
            await emailAdapter.sendEmail(findConfirmationData.email, newConfirmationData.confirmationCode)
        } catch (e) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    },

    async confirmUser(body: CodeConfirmModel): Promise<ResultCodeHandler<null>> {
        return await usersRepository.confirmUser(body)
    },

    async getUserById(id: ObjectId): Promise<ObjectId | null> {
        return await usersRepository.findUserById(id)
    },

    async createAdminUser(body: UserInputModel): Promise<ObjectId> {

        const passwordHash = await generateHash(body.password)

        const newAdmin: AdminClass = new AdminClass(body.login, body.email, passwordHash)
        return await usersRepository.createUser(newAdmin)

    },

    async createUser(body: UserInputModel): Promise<ResultCodeHandler<null>> {
        const findUser = await usersQueryRepository.findUserLoginOrEmail(body)
        if (findUser) {
            return resultCodeMap(false, null, Errors.Bad_Request)
        }

        const passwordHash = await generateHash(body.password)

        const newUser: UsersDbModel = {
            accountData: new AdminClass(body.login, body.email, passwordHash),
            emailConfirmation: new EmailConfirmationClass(body.email)
        }

        const resultInsertUser = await usersRepository.createUser(newUser)
        if (!resultInsertUser) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        const code = newUser.emailConfirmation.confirmationCode
        const resultSendEmail = await emailAdapter.sendEmail(body.email, code)
        if (!resultSendEmail) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    },

    async checkCredentials(body: LoginInputModel): Promise<WithId<AdminDbModel> | null> {
        const user: WithId<AdminDbModel> | null = await usersQueryRepository.findUserLoginOrEmail(body)
        if (!user) return null
        const encodingUser = await bcrypt.compare(body.password, user.password)
        if (!encodingUser) return null
        return user
    },

    async deleteUsersById(id: string): Promise<boolean> {
        return await usersRepository.deleteUsersById(id)
    },

    async passwordRecovery(body: EmailResending): Promise<ResultCodeHandler<null>> {
        const recoveryCode = uuidv4()
        const findUser: WithId<AdminDbModel> | null = await usersQueryRepository.findUserByEmail(body)
        if (!findUser) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        try {
            await emailAdapter.sendPassword(body.email, recoveryCode)
            await usersRepository.recoveryPassword(findUser._id, recoveryCode)
            return resultCodeMap(true, null)
        } catch (e) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }

    },

    async setNewPassword(body: RecoveryPasswordModel) {
        const findUser = await usersQueryRepository.findUserByCode(body.recoveryCode)
        if(!findUser) return resultCodeMap(false, null, Errors.Not_Found)

        if(findUser.code !== body.recoveryCode) return resultCodeMap(false, null, Errors.Code_No_Valid)

        if(findUser.exp! < new Date()) return resultCodeMap(false, null, Errors.Expiration_Date)

        const newPasswordHash = await generateHash(body.newPassword)
        const resultUpdatePassword = await usersRepository.updatePassword(findUser._id, newPasswordHash)

        if(!resultUpdatePassword) return resultCodeMap(false, null, Errors.Error_Server)

        return resultCodeMap(true, null)
    }
}