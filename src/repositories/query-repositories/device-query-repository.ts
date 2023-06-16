import {authDeviceCollections} from "../../db/db";
import {devicesMap} from "../../utils/helpers/devices-map";


export const deviceQueryRepository = {

    async getAllDevicesCurrentUser(userId: string) {
        const deviceArray = await authDeviceCollections.find({userId: userId}).toArray()
        return deviceArray.map(devicesMap)
    },

    async findDeviceByUserId(userId: string) {
        return await authDeviceCollections.findOne({userId: userId})
    }
}