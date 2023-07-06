import "reflect-metadata";
import {IncomingHttpHeaders} from "http";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {TokensModel} from "../models/jwt-models/jwt-access-model";
import {DevicesDbModel} from "../models/divice-model/devices-db-model";
import {isBefore} from "date-fns";
import {ObjectId, WithId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {JwtPayload} from "jsonwebtoken";
import {Devices} from "../classes/devices-class";
import {JwtService} from "../application/jwt-service";
import {DeviceRepository} from "../repositories/device-repository";
import {UsersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {UsersService} from "./users-service";
import {DeviceQueryRepository} from "../repositories/query-repositories/device-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class DevicesService {
    constructor(@inject(JwtService) protected jwtService: JwtService,
                @inject(DeviceRepository) protected deviceRepository: DeviceRepository,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(UsersService) protected usersService: UsersService,
                @inject(DeviceQueryRepository) protected deviceQueryRepository: DeviceQueryRepository) {
    }
    async updateRefreshToken(token: string): Promise<ResultCodeHandler<TokensModel>> {
        const decodeToken: JwtPayload | null = await this.jwtService.decodeToken(token)
        if (!decodeToken) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const device: DevicesDbModel | null = await this.deviceRepository.findDeviceByDeviceId(decodeToken.deviceId)
        if (!device) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const user = await this.usersQueryRepository.findUserById(new ObjectId(device.userId))
        if (!user) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        if (decodeToken.iat !== device.issuedAt) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        if (isBefore(Date.now(), decodeToken.exp!)) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const newAccessToken = await this.jwtService.createAccessToken(user)
        const newRefreshToken = await this.jwtService.createRefreshToken(device.deviceId, user._id!.toString())
        const decodeNewToken = await this.jwtService.decodeToken(newRefreshToken)
        const updateDateToken = {
            issuedAt: decodeNewToken!.iat,
            expiresAt: decodeNewToken!.exp
        }

        const updateResult = await this.deviceRepository.updateTokenInfo(updateDateToken, device.deviceId)
        if (!updateResult) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        const newTokens = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return resultCodeMap(true, newTokens)
    }

    async loginDevice(body: LoginInputModel, header: IncomingHttpHeaders, ip: string): Promise<ResultCodeHandler<TokensModel>> {
        const user: WithId<AdminDbModel> | null = await this.usersService.checkCredentials(body)
        if (!user) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }

        const deviceId = uuidv4()
        const accessToken = await this.jwtService.createAccessToken(user)
        const refreshToken = await this.jwtService.createRefreshToken(deviceId, user._id!.toString())
        const tokenDecode = await this.jwtService.decodeToken(refreshToken)
        if (!tokenDecode) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }

        const newDevice: DevicesDbModel = new Devices(
            tokenDecode.deviceId,
            header["user-agent"],
            tokenDecode.iat!,
            tokenDecode.exp!,
            user._id.toString(),
            ip)

        const isSave = await this.deviceRepository.saveLoginDevice(newDevice)
        if (!isSave) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        const tokens = {accessToken: accessToken, refreshToken: refreshToken}
        return resultCodeMap(true, tokens)
    }

    async terminateAllOtherSessions(userId: string, deviceId: string) {
        const findSessions = await this.deviceQueryRepository.getAllDevicesCurrentUser(userId)
        if (!findSessions) return false

        for (const session of findSessions) {
            if (session.deviceId !== deviceId) await this.deviceRepository.terminateSessions(session.deviceId)
        }
        return true
    }

    async terminateThisSession(deviceId: string, userId: string) {
        const findSession = await this.deviceRepository.findDeviceByDeviceId(deviceId)
        if(!findSession) {
            return resultCodeMap(false, null, Errors.Not_Found)
        }
        if(findSession.userId !== userId) {
            return resultCodeMap(false, null, Errors.Forbidden)
        }
        const resultDelete = await this.deviceRepository.terminateSessions(deviceId)
        if(!resultDelete) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }

    async logoutUser(token: string) {
        const decodeToken = await this.jwtService.decodeToken(token)
        if(!decodeToken) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const user = await this.deviceQueryRepository.findDeviceByUserId(decodeToken.userId)
        if(!user) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const logoutDevice = await this.deviceRepository.tokenDecay(decodeToken.deviceId)
        if(!logoutDevice) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        return resultCodeMap(true, null)
    }
}
