import nodemailer from 'nodemailer'
import {UserInputModel} from "../models/users-model/user-input-model";


export const emailAdapter = {

    async sendEmail(body: UserInputModel) : Promise<boolean> {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'test.api.incub@gmail.com',
                pass: 'tovolmjhfzprftkl'
            }
        });
        let info = await transport.sendMail({
            from: 'Maxim <test.api.incub@gmail.com>',
            to: body.email,
            subject: 'Back-end Lessons,',
            html:  'https://somesite.com/confirm-email?code=your_confirmation_code'
        })
        return info.accepted.length > 0;
    }
}