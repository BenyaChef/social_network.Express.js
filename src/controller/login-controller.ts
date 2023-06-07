import {RequestWithBody} from "../models/request-models/request-types";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {MeViewModel} from "../models/users-model/me-view-model";
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


export const loginController = {

    async emailResending(req: RequestWithBody<EmailResending>, res: Response) {
        const resendingResult = await usersService.emailResending(req.body)
        if(resendingResult.error === Errors.Not_Found) {
            return res.status(HTTP_STATUS.Bad_request).send(EmailNotFound)
        }
        if(resendingResult.error === Errors.Is_Confirmed) {
            return res.status(HTTP_STATUS.Bad_request).send(EmailConfirmed)
        }
        if(resendingResult.error === Errors.Error_Server) {
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
        const token = await jwtService.createJWT(user)
        return res.status(HTTP_STATUS.OK).send(token)
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
        const user: MeViewModel | null = await usersQueryRepository.getUserByIdByToken(req.userId!)
        if (!user) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res.status(HTTP_STATUS.OK).send(user)
    }
}

