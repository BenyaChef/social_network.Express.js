import jwt, {JwtPayload} from 'jsonwebtoken';
import {settings} from "../settings";
import {TokensModel} from "../models/jwt-models/jwt-access-model";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";

export const jwtService = {

    async createAccessToken(user: AdminDbModel) {
        return jwt.sign({userID: user._id}, settings.SECRET_KEY, {expiresIn: '100s'})

    },

    async createRefreshToken(deviceId: string) {
        return jwt.sign({deviceId: deviceId}, settings.SECRET_KEY, {expiresIn: '100s'})

    },

    async verifyJWT(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.SECRET_KEY)
            return new ObjectId(result.userID)
        } catch (e) {
            return null
        }

    },

    async decodeToken(token: string) {
        return jwt.verify(token, settings.SECRET_KEY) as JwtPayload
    }
}
