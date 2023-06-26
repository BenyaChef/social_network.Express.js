import {Request, Response, NextFunction} from "express";
import {TypeRequestCount} from "../models/request-models/api-request-count-model";
import {RequestCountsModel} from "../db/db";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

export const limitRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const reqData: TypeRequestCount = {
        ip: req.ip,
        URL: req.originalUrl,
        data: new Date(),
        method: req.method
    }

    await RequestCountsModel.create(reqData)

    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter = {$and: [{ip: reqData.ip}, {URL: reqData.URL}, {data: {$gte: tenSecondsAgo}}, {method: reqData.method}]}

    const count = await RequestCountsModel.countDocuments(filter)
    if (count > 5) {
        return res.sendStatus(HTTP_STATUS.Too_Many_Requests)
    } else {
        return next()
    }
}
