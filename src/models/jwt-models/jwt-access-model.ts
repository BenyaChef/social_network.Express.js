import {ObjectId} from "mongodb";

export interface DeviceInfoModel {
    accessToken: string
    refreshToken: string
    issuedAt: Date
    expiresAt: Date
    deviceId: string
    userId: ObjectId
}
