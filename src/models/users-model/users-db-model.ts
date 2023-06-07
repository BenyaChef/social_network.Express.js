import {AdminDbModel} from "./admin-db-model";
import {EmailConfirmationModel} from "../email-model.ts/email-confirmation-model";

export interface UsersDbModel {
    accountData: AdminDbModel
    emailConfirmation: EmailConfirmationModel
}