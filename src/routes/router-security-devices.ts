import {Router} from "express";
import {devicesController} from "../controller/devices-controller";

export const routerSecurityDevices = Router({})

routerSecurityDevices.get('/devices',
    devicesController.getAllDevicesCurrentUser)

routerSecurityDevices.delete('/devices',
    devicesController.terminateAllOtherSessions)

routerSecurityDevices.delete('/devices/:id',
    devicesController.terminateSpecifiedDeviceSession)