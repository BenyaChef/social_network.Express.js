import {authDeviceCollections} from "../db/db";
import {DevicesDbModel} from "../models/divice-model/devices-db-model";

export const deviceRepository = {

    async updateTokenInfo(updateDateToken: object, deviceId: string) {
        return await authDeviceCollections.updateOne({deviceId: deviceId}, {$set: updateDateToken})
    },

    async findDeviceByDeviceId(deviceId: string) {
        return await authDeviceCollections.findOne({deviceId: deviceId})
    },

    async saveLoginDevice(newDevice: DevicesDbModel) {
        return await authDeviceCollections.insertOne(newDevice)
    }
}