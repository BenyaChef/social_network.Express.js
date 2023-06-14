import {RequestWithBody} from "../models/request-models/request-types";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {Errors} from "../enum/errors";
import {
    CodeIncorrectMessage,
    EmailConfirmed, EmailNotFound,
    ErrorsMessages,
    ExpiredCodeMessage,
} from "../enum/errors-message";
import {UserInputModel} from "../models/users-model/user-input-model";
import {CodeConfirmModel} from "../models/users-model/code-confirm-model";
import {EmailResending} from "../models/email-model.ts/email-confirmation-model";
import {mapAuthUser} from "../utils/map-me-user";
import {blackList} from "../db/db";
import {devicesController} from "./devices-controller";
import {devicesService} from "../domain/devices-service";


export const loginController = {

    async emailResending(req: RequestWithBody<EmailResending>, res: Response) {
        const resendingResult = await usersService.emailResending(req.body)
        if (resendingResult.error === Errors.Not_Found) {
            return res.status(HTTP_STATUS.Bad_request).send(EmailNotFound)
        }
        if (resendingResult.error === Errors.Is_Confirmed) {
            return res.status(HTTP_STATUS.Bad_request).send(EmailConfirmed)
        }
        if (resendingResult.error === Errors.Error_Server) {
            return res.status(HTTP_STATUS.Server_error)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    },

    async confirmUser(req: RequestWithBody<CodeConfirmModel>, res: Response) {
        const isConfirm = await usersService.confirmUser(req.body)
        if (isConfirm.error === Errors.Code_No_Valid) {
            return res.status(HTTP_STATUS.Bad_request).json(CodeIncorrectMessage)
        }
        if (isConfirm.error === Errors.Expiration_Date) {
            return res.status(HTTP_STATUS.Bad_request).json(ExpiredCodeMessage)
        }
        if (isConfirm.error === Errors.Is_Confirmed) {
            return res.status(HTTP_STATUS.Bad_request).json(EmailConfirmed)
        }
        return res.sendStatus(HTTP_STATUS.No_content)

    },

    async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {

        const user: AdminDbModel | null = await usersService.checkCredentials(req.body)
        if (!user) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const deviceInfo = await jwtService.createJWT(user)

        await devicesService.loginDevice(deviceInfo, req.headers, req.ip)
        return res
            .cookie('refreshToken', deviceInfo.refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUS.OK).send({accessToken: deviceInfo.accessToken})
    },

    async registrationNewUser(req: RequestWithBody<UserInputModel>, res: Response) {
        const resultRegistration = await usersService.createUser(req.body)
        if (resultRegistration.error === Errors.Bad_Request) {
            return res.status(HTTP_STATUS.Bad_request).json(ErrorsMessages)
        }
        if (resultRegistration.success) {
            return res.sendStatus(HTTP_STATUS.No_content)
        }
        return res.sendStatus(HTTP_STATUS.Server_error)
    },

    async getAuthUser(req: Request, res: Response) {
        const user: AdminDbModel | null = await usersQueryRepository.findUserById(req.userId!)
        if (!user) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res.status(HTTP_STATUS.OK).send(mapAuthUser(user))
    },

    async generatedNewTokens(req: Request, res: Response) {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const findToken = await blackList.findOne({token: token})
        if(findToken) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const userId = await jwtService.verifyJWT(token)
        if (!userId) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const authUser = await usersQueryRepository.findUserById(userId)
        if (!authUser) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        await blackList.insertOne({token: token})
        const newTokens = await jwtService.createJWT(authUser)
        return res
            .cookie('refreshToken', newTokens.refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUS.OK)
            .json({accessToken: newTokens.accessToken})
    },

    async logoutUser(req: Request, res: Response) {
        const tokenRefresh = req.cookies.refreshToken
        if (!tokenRefresh) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const findToken = await blackList.findOne({token: tokenRefresh})
        if(findToken) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const userId = await jwtService.verifyJWT(tokenRefresh)
        if (!userId) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        await blackList.insertOne({token: tokenRefresh})
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}

