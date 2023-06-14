import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {DeviceInfoModel} from "../models/jwt-models/jwt-access-model";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {JwtVerifyModel} from "../models/jwt-models/jwt-verify-model";
import {ObjectId} from "mongodb";
import add from "date-fns/add";
import {v4 as uuidv4} from "uuid";


export const jwtService = {

    async createJWT(user: AdminDbModel): Promise<DeviceInfoModel> {
        const deviceId = uuidv4()
        const accessToken: string = jwt.sign({userID: user._id}, settings.SECRET_KEY, {expiresIn: '10s'})
        const refreshToken: string = jwt.sign({deviceId: deviceId}, settings.SECRET_KEY, {expiresIn: '20s'})
        const newDate = new Date()

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            issuedAt: newDate,
            expiresAt: add(newDate, {seconds: 20}),
            deviceId: deviceId,
            userId: user._id!
        }
    },

    async verifyJWT(token: string): Promise<ObjectId | null> {
        try {
            const result: JwtVerifyModel | any = jwt.verify(token, settings.SECRET_KEY)
            return new ObjectId(result.userID)
        } catch (e) {
            return null
        }

    }
}