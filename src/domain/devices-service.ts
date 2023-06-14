import {DeviceInfoModel} from "../models/jwt-models/jwt-access-model";
import {IncomingHttpHeaders} from "http";
import {deviceRepository} from "../repositories/device-repository";

export const devicesService = {

   async loginDevice(body: DeviceInfoModel, header: IncomingHttpHeaders, ip: string) {
       const newDevice = {
           deviceId: body.deviceId,
           title: header["user-agent"] || 'agent undefined',
           lastActiveDate: body.issuedAt,
           expiresAt: body.expiresAt,
           userId: body.userId,
           ip: ip
       }

       await deviceRepository.saveLoginDevice(newDevice)
   }
}