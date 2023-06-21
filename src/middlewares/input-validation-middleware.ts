import {ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

type Result<T> = {
  resultCode: number,
  message?: string
    data: T
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(HTTP_STATUS.Bad_request).json({
            errorsMessages: errors.array({onlyFirstError: true})
                .map((e: ValidationError) => {
                return {
                    message: e.msg,
                    field: e.type === 'field' ? e.path : null
                }
            })
        })
    } else {
        next()
    }
}