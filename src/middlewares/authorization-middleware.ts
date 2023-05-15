import {NextFunction, Request, Response} from "express";

export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const basic64 = Buffer.from('admin:qwerty').toString('base64')
    const loginData = `Basic ${basic64}`

    if (req.headers.authorization !== loginData) {
        res.sendStatus(401)
    } else next()

}
