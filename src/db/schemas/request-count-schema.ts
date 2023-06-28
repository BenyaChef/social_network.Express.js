import mongoose from "mongoose";
import {TypeRequestCount} from "../../models/request-models/api-request-count-model";

export const RequestCountSchema = new mongoose.Schema<TypeRequestCount>({
    ip: {type: String, required: true},
    URL: {type: String, required: true},
    createdAt: {type: Date, required: true},
    method: {type: String, required: true},
})