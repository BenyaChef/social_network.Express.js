import mongoose from "mongoose";
import {EmailConfirmationModel} from "../../models/email-model.ts/email-confirmation-model";

export const EmailsConfirmSchema = new mongoose.Schema<EmailConfirmationModel>({
    email: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
})