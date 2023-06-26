import mongoose from "mongoose";
import {DevicesDbModel} from "../../models/divice-model/devices-db-model";

export const DeviceSchema = new mongoose.Schema<DevicesDbModel>({
    deviceId: {type: String, required: true},
    title: {type: String, required: true},
    issuedAt: {type: Number, required: true},
    expiresAt: {type: Number, required: true},
    userId: {type: String, required: true},
    ip: {type: String, required: true},
})