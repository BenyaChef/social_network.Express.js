import {RequestWithBody} from "../models/request-models/request-types";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {Errors} from "../enum/errors";
import {
    CodeIncorrectMessage,
    EmailConfirmed,
    EmailNotFound,
    ErrorsMessages,
    ExpiredCodeMessage, RecoveryCodeIncorrectMessage,
} from "../enum/errors-message";
import {UserInputModel} from "../models/users-model/user-input-model";
import {CodeConfirmModel} from "../models/users-model/code-confirm-model";
import {EmailResending} from "../models/email-model.ts/email-confirmation-model";
import {mapAuthUser} from "../utils/map-me-user";
import {devicesService} from "../domain/devices-service";
import {RecoveryPasswordModel} from "../models/recovery-password-model/recovery-password-model";
import {WithId} from "mongodb";

class AuthController {
    async setNewPassword(req: RequestWithBody<RecoveryPasswordModel>, res: Response) {
        const resultUpdatePassword = await usersService.setNewPassword(req.body)
        if (!resultUpdatePassword.success) {
            return res.status(HTTP_STATUS.Bad_request).json(RecoveryCodeIncorrectMessage)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }

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
    }

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

    }

    async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {
        const resultLogin = await devicesService.loginDevice(req.body, req.headers, req.ip)
        if (!resultLogin.data) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res
            .cookie('refreshToken', resultLogin.data.refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUS.OK).send({accessToken: resultLogin.data.accessToken})
    }

    async registrationNewUser(req: RequestWithBody<UserInputModel>, res: Response) {
        const resultRegistration = await usersService.createUser(req.body)
        if (resultRegistration.error === Errors.Bad_Request) {
            return res.status(HTTP_STATUS.Bad_request).json(ErrorsMessages)
        }
        if (resultRegistration.success) {
            return res.sendStatus(HTTP_STATUS.No_content)
        }
        return res.sendStatus(HTTP_STATUS.Server_error)
    }

    async passwordRecovery(req: RequestWithBody<EmailResending>, res: Response) {
        const resultPasswordRecovery = await usersService.passwordRecovery(req.body)
        if (resultPasswordRecovery.error === Errors.Not_Found) return res.sendStatus(HTTP_STATUS.No_content)
        if (resultPasswordRecovery.error === Errors.Error_Server) return res.sendStatus(HTTP_STATUS.Server_error)
        return res.sendStatus(HTTP_STATUS.No_content)
    }

    async getAuthUser(req: Request, res: Response) {
        const user: WithId<AdminDbModel> | null = await usersQueryRepository.findUserById(req.userId!)
        if (!user) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res.status(HTTP_STATUS.OK).send(mapAuthUser(user))
    }

    async generatedNewTokens(req: Request, res: Response) {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const resultUpdateToken = await devicesService.updateRefreshToken(token)
        if (!resultUpdateToken.data) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res
            .cookie('refreshToken', resultUpdateToken.data.refreshToken, {httpOnly: true, secure: true})
            .status(HTTP_STATUS.OK)
            .send({accessToken: resultUpdateToken.data.accessToken})
    }

    async logoutUser(req: Request, res: Response) {
        const tokenRefresh = req.cookies.refreshToken
        if (!tokenRefresh) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const resultLogout = await devicesService.logoutUser(tokenRefresh)
        if (resultLogout.error === Errors.Unauthorized) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}

export const authController = new AuthController()
