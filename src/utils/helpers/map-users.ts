import {UsersDBModel} from "../../models/users-model/users-db-model";
import {UserViewModel} from "../../models/users-model/user-view-model";

export function mapUsers(user: UsersDBModel) : UserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt

    }
}