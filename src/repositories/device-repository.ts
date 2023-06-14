import {authDeviceCollections} from "../db/db";

export const deviceRepository = {
   async saveLoginDevice(newDevice: any) {
        await authDeviceCollections.insertOne(newDevice)
    }
}