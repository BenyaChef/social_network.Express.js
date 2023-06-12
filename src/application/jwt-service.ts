import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {JwtAccessModel} from "../models/jwt-models/jwt-access-model";
import {AdminDbModel} from "../models/users-model/admin-db-model";
import {JwtVerifyModel} from "../models/jwt-models/jwt-verify-model";
import {ObjectId} from "mongodb";


export const jwtService = {

    async createJWT(user: AdminDbModel): Promise<JwtAccessModel> {
        const accessToken: string = jwt.sign({userID: user._id}, settings.SECRET_KEY, {expiresIn: '10s'})
        const refreshToken: string = jwt.sign({userID: user._id}, settings.SECRET_KEY, {expiresIn: '20s'})
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
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