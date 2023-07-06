import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {JwtService} from "../application/jwt-service";
import {UsersModel} from "../db/db";

export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const basic64 = Buffer.from('admin:qwerty').toString('base64')
    const loginData = `Basic ${basic64}`

    if (req.headers.authorization !== loginData) {
        res.sendStatus(HTTP_STATUS.Unauthorized)
    } else
        next()

}

export const authJWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }

    const token = req.headers.authorization.slice(7)

    const userId = await JwtService.verifyJWT(token)
    if (!userId) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    req.userId = await UsersModel.findOne({_id: userId})
    return next()
}


export const checkAuthUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        req.userId = null
        return next()
    }

    const token = req.headers.authorization.slice(7)

    const userId = await JwtService.verifyJWT(token)
    if (!userId) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    req.userId = await UsersModel.findOne({_id: userId})
    return next()
}


