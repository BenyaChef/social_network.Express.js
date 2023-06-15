import {DevicesDbModel} from "../../models/divice-model/devices-db-model";


export const devicesMap = (device: DevicesDbModel) => {
    return  {
        ip: device.ip,
        deviceId: device.deviceId,
        title: device.title,
        lastActiveDate: device.issuedAt
    }
}