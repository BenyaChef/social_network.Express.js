import {Router} from "express";
import {devicesController} from "../composition-root";

export const routerSecurityDevices = Router({})

routerSecurityDevices.get('/devices',
    devicesController.getAllDevicesCurrentUser.bind(devicesController))

routerSecurityDevices.delete('/devices',
    devicesController.terminateAllOtherSessions.bind(devicesController))

routerSecurityDevices.delete('/devices/:id',
    devicesController.terminateSpecifiedDeviceSession.bind(devicesController))