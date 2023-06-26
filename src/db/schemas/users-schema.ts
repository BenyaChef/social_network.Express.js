import mongoose from "mongoose";
import {WithId} from "mongodb";
import {AdminDbModel} from "../../models/users-model/admin-db-model";

export const UsersSchema = new mongoose.Schema<WithId<AdminDbModel>>({
    email: {type: String, required: true},
    password: {type: String, required: true},
    login: {type: String, required: true},
    createdAt: {type: String, required: true},
    code: {type: String, required: false},
    exp: {type: Date, required: false}
})