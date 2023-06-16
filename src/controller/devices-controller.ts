import {Request, Response} from "express";
import {deviceQueryRepository} from "../repositories/query-repositories/device-query-repository";
import {jwtService} from "../application/jwt-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {devicesService} from "../domain/devices-service";
import {Errors} from "../enum/errors";

export const devicesController = {

    async getAllDevicesCurrentUser(req: Request, res: Response) {
        const tokenDecode = await jwtService.decodeToken(req.cookies.refreshToken)
        if (!tokenDecode) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const devicesCurrentUser = await deviceQueryRepository.getAllDevicesCurrentUser(tokenDecode.userId)
        return res.status(HTTP_STATUS.OK).send(devicesCurrentUser)
    },

    async terminateAllOtherSessions(req: Request, res: Response) {
        const tokenDecode = await jwtService.decodeToken(req.cookies.refreshToken)
        if (!tokenDecode) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const findCurrentDevices = await devicesService.terminateAllOtherSessions(tokenDecode.userId, tokenDecode.deviceId)
        if(!findCurrentDevices) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res.sendStatus(HTTP_STATUS.No_content)

    },

    async terminateSpecifiedDeviceSession(req: Request, res: Response) {
        const tokenDecode = await jwtService.decodeToken(req.cookies.refreshToken)
        if(!tokenDecode) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const resultTerminate = await devicesService.terminateThisSession(req.params.id, tokenDecode.userId)

        if(resultTerminate.error === Errors.Forbidden) {
            return res.sendStatus(HTTP_STATUS.Forbidden)
        }
        if(!resultTerminate.success) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}