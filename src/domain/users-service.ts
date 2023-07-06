import "reflect-metadata";
import {UserInputModel} from "../models/users-model/user-input-model";
import bcrypt from 'bcrypt'
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {ObjectId, WithId} from "mongodb";
import {UsersRepository} from "../repositories/users-repository";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {EmailAdapter} from "../adapters/email-adapter";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {generateHash} from "../utils/helpers/generate-hash";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {CodeConfirmModel} from "../models/users-model/code-confirm-model";
import {UsersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {EmailResending} from "../models/email-model.ts/email-confirmation-model";
import {RecoveryPasswordModel} from "../models/recovery-password-model/recovery-password-model";
import {AdminClass} from "../classes/admin-class";
import {EmailConfirmationClass} from "../classes/email-confirmation-class";
import {UsersDbModel} from "../models/users-model/users-db-model";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(EmailAdapter) protected emailAdapter: EmailAdapter) {
    }

    async emailResending(body: EmailResending): Promise<ResultCodeHandler<null>> {
        const findConfirmationData = await this.usersQueryRepository.findUserEmail(body)

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
        const result = await this.usersRepository.resendingEmail(newConfirmationData)

        if (!result) return resultCodeMap(false, null, Errors.Error_Server)

        try {
            await this.emailAdapter.sendEmail(findConfirmationData.email, newConfirmationData.confirmationCode)
        } catch (e) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }

    async confirmUser(body: CodeConfirmModel): Promise<ResultCodeHandler<null>> {
        return await this.usersRepository.confirmUser(body)
    }

    async createAdminUser(body: UserInputModel): Promise<ObjectId> {

        const passwordHash = await generateHash(body.password)

        const newAdmin: AdminClass = new AdminClass(body.login, body.email, passwordHash)
        return await this.usersRepository.createUser(newAdmin)

    }

    async createUser(body: UserInputModel): Promise<ResultCodeHandler<null>> {
        const findUser = await this.usersQueryRepository.findUserLoginOrEmail(body)
        if (findUser) {
            return resultCodeMap(false, null, Errors.Bad_Request)
        }

        const passwordHash = await generateHash(body.password)

        const newUser: UsersDbModel = {
            accountData: new AdminClass(body.login, body.email, passwordHash),
            emailConfirmation: new EmailConfirmationClass(body.email)
        }

        const resultInsertUser = await this.usersRepository.createUser(newUser)
        if (!resultInsertUser) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        const code = newUser.emailConfirmation.confirmationCode
        const resultSendEmail = await this.emailAdapter.sendEmail(body.email, code)
        if (!resultSendEmail) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }

    async checkCredentials(body: LoginInputModel): Promise<WithId<AdminDbModel> | null> {
        const user: WithId<AdminDbModel> | null = await this.usersQueryRepository.findUserLoginOrEmail(body)
        if (!user) return null
        const encodingUser = await bcrypt.compare(body.password, user.password)
        if (!encodingUser) return null
        return user
    }

    async deleteUsersById(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUsersById(id)
    }

    async passwordRecovery(body: EmailResending): Promise<ResultCodeHandler<null>> {
        const recoveryCode = uuidv4()
        const findUser: WithId<AdminDbModel> | null = await this.usersQueryRepository.findUserByEmail(body)
        if (!findUser) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        try {
            await this.emailAdapter.sendPassword(body.email, recoveryCode)
            await this.usersRepository.recoveryPassword(findUser._id, recoveryCode)
            return resultCodeMap(true, null)
        } catch (e) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }

    }

    async setNewPassword(body: RecoveryPasswordModel) {
        const findUser = await this.usersQueryRepository.findUserByCode(body.recoveryCode)
        if (!findUser) return resultCodeMap(false, null, Errors.Not_Found)

        if (findUser.code !== body.recoveryCode) return resultCodeMap(false, null, Errors.Code_No_Valid)

        if (findUser.exp! < new Date()) return resultCodeMap(false, null, Errors.Expiration_Date)

        const newPasswordHash = await generateHash(body.newPassword)
        const resultUpdatePassword = await this.usersRepository.updatePassword(findUser._id, newPasswordHash)

        if (!resultUpdatePassword) return resultCodeMap(false, null, Errors.Error_Server)

        return resultCodeMap(true, null)
    }
}
