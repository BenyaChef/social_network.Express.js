import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../../settings";
import {JwtAccessModel} from "../models/jwt-models/jwt-access-model";


export const jwtService = {

   async createJWT(user: ObjectId): Promise<JwtAccessModel> {
        const token: string = jwt.sign(user, settings.SECRET_KEY, {expiresIn: '1h'})
        return {
            accessToken: token
        }
    }
}