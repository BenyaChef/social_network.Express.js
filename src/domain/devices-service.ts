import {IncomingHttpHeaders} from "http";
import {deviceRepository} from "../repositories/device-repository";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {usersService} from "./users-service";
import {jwtService} from "../application/jwt-service";
import {LoginInputModel} from "../models/login-models/login-input-model";
import {resultCodeMap} from "../utils/helpers/result-code";
import {Errors} from "../enum/errors";
import {ResultCodeHandler} from "../models/result-code-handler";
import {TokensModel} from "../models/jwt-models/jwt-access-model";
import {DevicesDbModel} from "../models/divice-model/devices-db-model";
import {isBefore} from "date-fns";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {JwtPayload} from "jsonwebtoken";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";


export const devicesService = {

    async updateRefreshToken(token: string) : Promise<ResultCodeHandler<TokensModel>> {
        const decodeToken : JwtPayload | null = await jwtService.decodeToken(token)
        if (!decodeToken) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const device : DevicesDbModel | null = await deviceRepository.findDeviceByDeviceId(decodeToken.deviceId)
        if (!device) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const user = await usersQueryRepository.findUserById(new ObjectId(device.userId))
        if(!user) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        if (decodeToken.iat !== device.issuedAt) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        if (isBefore(Date.now(), decodeToken.exp!)) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const newAccessToken = await jwtService.createAccessToken(user)
        const newRefreshToken = await jwtService.createRefreshToken(device.deviceId, user._id!.toString())
        const decodeNewToken = await jwtService.decodeToken(newRefreshToken)
        const updateDateToken = {
            issuedAt: decodeNewToken!.iat,
            expiresAt: decodeNewToken!.exp
        }

        const updateResult = await deviceRepository.updateTokenInfo(updateDateToken, device.deviceId)
        if(!updateResult) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        const newTokens = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }

        return resultCodeMap(true, newTokens)
    },

    async loginDevice(body: LoginInputModel, header: IncomingHttpHeaders, ip: string): Promise<ResultCodeHandler<TokensModel>> {
        const user: AdminDbModel | null = await usersService.checkCredentials(body)
        if (!user) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const deviceId = uuidv4()
        const accessToken = await jwtService.createAccessToken(user)
        const refreshToken = await jwtService.createRefreshToken(deviceId, user._id!.toString())
        const tokenDecode = await jwtService.decodeToken(refreshToken)
        if(!tokenDecode) {
            return resultCodeMap(false, null, Errors.Unauthorized)
        }
        const newDevice: DevicesDbModel = {
            deviceId: tokenDecode.deviceId,
            title: header["user-agent"] || 'agent undefined',
            issuedAt: tokenDecode.iat!,
            expiresAt: tokenDecode.exp!,
            userId: user._id!.toString(),
            ip: ip
        }

        const isSave = await deviceRepository.saveLoginDevice(newDevice)
        if (!isSave) {
            return resultCodeMap(false, null, Errors.Error_Server)
        }
        const tokens = {accessToken: accessToken, refreshToken: refreshToken}
        return resultCodeMap(true, tokens)
    },
}