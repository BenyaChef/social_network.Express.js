import nodemailer from 'nodemailer'
import {UserInputModel} from "../models/users-model/user-input-model";
import {EmailConfirmationModel} from "../models/email-model.ts/email-confirmation-model";


export const emailAdapter = {

    async sendEmail(inputData: UserInputModel | EmailConfirmationModel, code: string): Promise<boolean> {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'test.api.incub@gmail.com',
                pass: 'tovolmjhfzprftkl'
            }
        });
        let info = await transport.sendMail({
            from: 'Maxim <test.api.incub@gmail.com>',
            to: inputData.email,
            subject: 'Back-end Lessons,',
            html: ` <h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                    </p>`
        })
        return info.accepted.length > 0;
    }
}