import {RequestWithBody} from "../models/request-models/request-types";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

export const loginController = {

    async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {
        const checkResult: boolean = await usersService.checkCredentials(req.body)
        if(!checkResult) return res.sendStatus(HTTP_STATUS.Unauthorized)
        return res.sendStatus(HTTP_STATUS.No_content)
    },

    async getAuthUser(req: Request, res: Response) {

    }
}