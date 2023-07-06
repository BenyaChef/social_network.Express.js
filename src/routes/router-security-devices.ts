import {Router} from "express";
import {container} from "../composition-root";
import {DevicesController} from "../controller/devices-controller";

const devicesController = container.resolve(DevicesController)
export const routerSecurityDevices = Router({})

routerSecurityDevices.get('/devices',
    devicesController.getAllDevicesCurrentUser.bind(devicesController))

routerSecurityDevices.delete('/devices',
    devicesController.terminateAllOtherSessions.bind(devicesController))

routerSecurityDevices.delete('/devices/:id',
    devicesController.terminateSpecifiedDeviceSession.bind(devicesController))