import "reflect-metadata";
import {injectable} from "inversify";
import jwt, {JwtPayload} from 'jsonwebtoken';
import {settings} from "../settings";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {ObjectId, WithId} from "mongodb";


@injectable()
export class JwtService {
    async createAccessToken(user: WithId<AdminDbModel>) {
        return jwt.sign({userID: user._id}, settings.SECRET_KEY, {expiresIn: '600s'})

    }

    async createRefreshToken(deviceId: string, userId: string) {
        return jwt.sign({deviceId: deviceId, userId: userId}, settings.SECRET_KEY, {expiresIn: '3600s'})

    }

   static async verifyJWT(token: string): Promise<ObjectId | null> {
        try {
            const result: any = jwt.verify(token, settings.SECRET_KEY)
            return new ObjectId(result.userID)
        } catch (e) {
            return null
        }

    }

    async decodeToken(token: string) {
        try {
            return jwt.verify(token, settings.SECRET_KEY) as JwtPayload
        } catch (e) {
            return null
        }

    }
}


