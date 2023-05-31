import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {ERRORS_MESSAGE} from "../enum/errors-validation-messages";

export const idValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(!ObjectId.isValid(req.params.id))  {
        return res.sendStatus(HTTP_STATUS.Not_found)
    } else {
       return next()
    }
}

export const blogIdInBodyValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (ObjectId.isValid(req.body.blogId)) {
        const isFind = await blogsQueryRepository.findBlogByID(req.body.blogId)
        if (!isFind) {
            throw new Error(ERRORS_MESSAGE.PATTERN_INCORRECT)
        }
    } else {
        return next()
    }
}