import "reflect-metadata";
import {Request, Response} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {Errors} from "../enum/errors";
import {JwtService} from "../application/jwt-service";
import {DeviceQueryRepository} from "../repositories/query-repositories/device-query-repository";
import {DevicesService} from "../domain/devices-service";
import {inject, injectable} from "inversify";

@injectable()
export class DevicesController {
    constructor(@inject(JwtService) protected jwtService: JwtService,
                @inject(DeviceQueryRepository) protected deviceQueryRepository: DeviceQueryRepository,
                @inject(DevicesService) protected devicesService: DevicesService) {
    }
    async getAllDevicesCurrentUser(req: Request, res: Response) {
        const tokenDecode = await this.jwtService.decodeToken(req.cookies.refreshToken)
        if (!tokenDecode) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const devicesCurrentUser = await this.deviceQueryRepository.getAllDevicesCurrentUser(tokenDecode.userId)
        return res.status(HTTP_STATUS.OK).send(devicesCurrentUser)
    }

    async terminateAllOtherSessions(req: Request, res: Response) {
        const tokenDecode = await this.jwtService.decodeToken(req.cookies.refreshToken)
        if (!tokenDecode) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const findCurrentDevices = await this.devicesService.terminateAllOtherSessions(tokenDecode.userId, tokenDecode.deviceId)
        if(!findCurrentDevices) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        return res.sendStatus(HTTP_STATUS.No_content)

    }

    async terminateSpecifiedDeviceSession(req: Request, res: Response) {
        const tokenDecode = await this.jwtService.decodeToken(req.cookies.refreshToken)
        if(!tokenDecode) {
            return res.sendStatus(HTTP_STATUS.Unauthorized)
        }
        const resultTerminate = await this.devicesService.terminateThisSession(req.params.id, tokenDecode.userId)

        if(resultTerminate.error === Errors.Forbidden) {
            return res.sendStatus(HTTP_STATUS.Forbidden)
        }
        if(!resultTerminate.success) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}
