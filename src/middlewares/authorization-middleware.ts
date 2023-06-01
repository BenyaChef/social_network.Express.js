import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const basic64 = Buffer.from('admin:qwerty').toString('base64')
    const loginData = `Basic ${basic64}`

    if (req.headers.authorization !== loginData) {
        res.sendStatus(HTTP_STATUS.Unauthorized)
    } else next()

}

export const authJWTTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if(!token) {
        res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    next()
}