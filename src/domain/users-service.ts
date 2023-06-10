import {UserInputModel} from "../models/users-model/user-input-model";
import bcrypt from 'bcrypt'
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {ObjectId} from "mongodb";
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


export const usersService = {

    async emailResending(body: EmailResending) : Promise<ResultCodeHandler<null>> {
        const findConfirmationData = await usersQueryRepository.findUserEmail(body)
        if(!findConfirmationData) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if(findConfirmationData.isConfirmed) {
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
        if(!result) return resultCodeMap(false, null, Errors.Error_Server)
        try {
            await emailAdapter.sendEmail(findConfirmationData, newConfirmationData.confirmationCode)
        } catch (e) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    },

    async confirmUser(body: CodeConfirmModel) : Promise<ResultCodeHandler<null>> {
        return await usersRepository.confirmUser(body)
    },

    async getUserById(id: ObjectId): Promise<ObjectId | null> {
        return await usersRepository.findUserById(id)
    },

    async createAdminUser(body: UserInputModel): Promise<ObjectId> {

        const passwordHash = await generateHash(body.password)

        const newAdmin: AdminDbModel = {
            login: body.login,
            email: body.email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(newAdmin)

    },

    async createUser(body: UserInputModel): Promise<ResultCodeHandler<null>> {
        const findUser = await usersQueryRepository.findUserLoginOrEmail(body)
        if (findUser) {
            return resultCodeMap(false, null, Errors.Bad_Request)
        }

        const passwordHash = await generateHash(body.password)

        const newUser = {
            accountData: {
                login: body.login,
                email: body.email,
                password: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                email: body.email,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 5
                }),
                isConfirmed: false
            }
        }
        const resultInsertUser = await usersRepository.createUser(newUser)
        if (!resultInsertUser) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        const code = newUser.emailConfirmation.confirmationCode
        const resultSendEmail = await emailAdapter.sendEmail(body, code)
        if (!resultSendEmail) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    },

    async checkCredentials(body: LoginInputModel): Promise<AdminDbModel | null> {
        const user: AdminDbModel | null = await usersQueryRepository.findUserLoginOrEmail(body)
        if (!user) return null
        const encodingUser = await bcrypt.compare(body.password, user.password)
        if (!encodingUser) return null
        return user
    },

    async deleteUsersById(id: string): Promise<boolean> {
        return await usersRepository.deleteUsersById(id)
    },

}