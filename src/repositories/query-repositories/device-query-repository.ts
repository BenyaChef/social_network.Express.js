import {DevicesModel} from "../../db/db";
import {devicesMap} from "../../utils/helpers/devices-map";

class DeviceQueryRepository {
    async getAllDevicesCurrentUser(userId: string) {
        const deviceArray = await DevicesModel.find({userId: userId}).lean()
        return deviceArray.map(devicesMap)
    }

    async findDeviceByUserId(userId: string) {
        return DevicesModel.findOne({userId: userId})
    }
}

export const deviceQueryRepository = new DeviceQueryRepository()