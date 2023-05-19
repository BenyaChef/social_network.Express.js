import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const idInputMiddleware = (req:Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    !errors.isEmpty() ? res.sendStatus(404) : next()
}