import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";


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

    const userId = await jwtService.verifyJWT(token)
    if (!userId) {
        return res.sendStatus(HTTP_STATUS.Unauthorized)
    }
    req.userId = await usersService.getUserById(userId)
    return next()
}



