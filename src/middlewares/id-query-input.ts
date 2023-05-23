import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {RequestWithParamsAndQuery} from "../models/request-models/request-types";
import {PostsPaginationSortQueryModel} from "../models/request-models/posts-paginations-sort-query-model";

export const idQueryInputMiddleware = (req: RequestWithParamsAndQuery<{ id: string }, PostsPaginationSortQueryModel>, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    !errors.isEmpty() ? res.sendStatus(404) : next()
}