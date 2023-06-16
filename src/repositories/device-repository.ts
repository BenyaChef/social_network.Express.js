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
    },

    async terminateSessions(deviceId: string) {
        const resultDelete = await authDeviceCollections.deleteOne({deviceId: deviceId})
        return resultDelete.deletedCount === 1
    },
    
    async tokenDecay(deviceId: string) {
        const decayResult = await authDeviceCollections.deleteOne({deviceId: deviceId})
        return decayResult.deletedCount === 1
    }
}