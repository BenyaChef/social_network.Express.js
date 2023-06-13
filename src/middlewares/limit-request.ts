import {Request, Response, NextFunction} from "express";
import {ApiRequestCountModel} from "../models/request-models/api-request-count-model";
import {requestsAPI} from "../db/db";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

export const limitRequest = async (req: Request, res: Response, next: NextFunction) => {
    const reqData: ApiRequestCountModel = {
        ip: req.ip,
        URL: req.originalUrl,
        data: new Date(),
        method: req.method
    }

    await requestsAPI.insertOne(reqData)

    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter = {$and: [{ip: reqData.ip}, {URL: reqData.URL}, {data: {$gte: tenSecondsAgo}}, {method: reqData.method}]}

    const count = await requestsAPI.countDocuments(filter)
    if (count > 5) {
        return res.sendStatus(HTTP_STATUS.Too_Many_Requests)
    } else {
        return next()
    }
}
