import {RequestWithBody} from "../models/request-models/request-types";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {UsersDBModel} from "../models/users-model/users-db-model";
import {jwtService} from "../application/jwt-service";

export const loginController = {

    async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {
        const user: UsersDBModel | null = await usersService.checkCredentials(req.body)
        if (!user) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const token = await jwtService.createJWT(user._id)
        return res.send(token)
    },

    async getAuthUser(req: Request, res: Response) {


    }
}