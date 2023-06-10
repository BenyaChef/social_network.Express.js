import {AdminDbModel} from "../models/users-model/admin-db-model";
import {MeViewModel} from "../models/users-model/me-view-model";

export const mapAuthUser = (user: AdminDbModel) : MeViewModel => {
    return {
        email: user.email,
        login: user.login,
        userId: user._id!.toString()
    }
}