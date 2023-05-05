import {param, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({
            errorsMessages: errors.array({onlyFirstError: true}).map(p => {
                return {
                    message: p.msg,
                    field: p.path
                }
            })
        })
    } else {
        next()
    }
}