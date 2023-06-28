import {Request, Response, NextFunction} from "express";
import {RequestCountsModel} from "../db/db";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {RequestCounter} from "../classes/request-counter-class";

export const limitRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const reqData: RequestCounter = new RequestCounter(req.ip, req.originalUrl, req.method)

    await RequestCountsModel.create(reqData)

    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter = {$and: [{ip: reqData.ip}, {URL: reqData.URL}, {createdAt: {$gte: tenSecondsAgo}}, {method: reqData.method}]}

    const count = await RequestCountsModel.countDocuments(filter)
    if (count > 5) {
        return res.sendStatus(HTTP_STATUS.Too_Many_Requests)
    } else {
        return next()
    }
}
