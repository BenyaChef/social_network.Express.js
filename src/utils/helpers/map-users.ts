import {AdminDbModel} from "../../models/users-model/admin-db-model";
import {UserViewModel} from "../../models/users-model/user-view-model";
import {WithId} from "mongodb";

export const mapUsers = (user: WithId<AdminDbModel>) : UserViewModel => {
    return {
        id: user._id!.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}