import {UsersDBModel} from "../models/users-model/users-db-model";
import {MeViewModel} from "../models/users-model/me-view-model";

export const mapMeUser = (user: UsersDBModel) : MeViewModel => {
    return {
        email: user.email,
        login: user.login,
        userId: user._id.toString()
    }
}