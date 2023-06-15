import {Request, Response} from "express";
import {deviceQueryRepository} from "../repositories/query-repositories/device-query-repository";
import {jwtService} from "../application/jwt-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";

export const devicesController = {

    async getAllDevicesCurrentUser(req: Request, res: Response) {
        const tokenDecode = await jwtService.decodeToken(req.cookies.refreshToken)
        if(!tokenDecode) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const devicesCurrentUser = await deviceQueryRepository.getAllDevicesCurrentUser(tokenDecode.userId)
        return res.status(HTTP_STATUS.OK).send(devicesCurrentUser)
    },

    async terminateOtherDeviceSessions(req: Request, res: Response) {

    },

    async terminateSpecifiedDeviceSession(req: Request, res: Response) {

    }
}