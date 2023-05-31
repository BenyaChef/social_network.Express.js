import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

export const idValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(!ObjectId.isValid(req.params.id))  {
        return res.sendStatus(HTTP_STATUS.Not_found)
    } else {
       return next()
    }
}

