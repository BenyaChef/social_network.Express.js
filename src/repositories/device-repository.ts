import {DevicesModel} from "../db/db";
import {DevicesDbModel} from "../models/divice-model/devices-db-model";

export const deviceRepository = {

    async updateTokenInfo(updateDateToken: object, deviceId: string) {
        return DevicesModel.updateOne({deviceId: deviceId}, {$set: updateDateToken})
    },

    async findDeviceByDeviceId(deviceId: string) {
        return  DevicesModel.findOne({deviceId: deviceId})
    },

    async saveLoginDevice(newDevice: DevicesDbModel) {
        return  DevicesModel.create(newDevice)
    },

    async terminateSessions(deviceId: string) {
        const resultDelete = await DevicesModel.deleteOne({deviceId: deviceId})
        return resultDelete.deletedCount === 1
    },
    
    async tokenDecay(deviceId: string) {
        const decayResult = await DevicesModel.deleteOne({deviceId: deviceId})
        return decayResult.deletedCount === 1
    }
}