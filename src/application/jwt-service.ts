import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {JwtAccessModel} from "../models/jwt-models/jwt-access-model";
import {UsersDBModel} from "../models/users-model/users-db-model";
import {JwtVerifyModel} from "../models/jwt-models/jwt-verify-model";
import {ObjectId} from "mongodb";


export const jwtService = {

    async createJWT(user: UsersDBModel): Promise<JwtAccessModel> {
        const token: string = jwt.sign({userID: user._id}, settings.SECRET_KEY, {expiresIn: '1h'})
        return {
            accessToken: token
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