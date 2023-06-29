import nodemailer from 'nodemailer'

export class EmailAdapter {
    async sendEmail(email: string, code: string): Promise<boolean> {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'test.api.incub@gmail.com',
                pass: 'tovolmjhfzprftkl'
            }
        });
        let info = await transport.sendMail({
            from: 'Maxim <test.api.incub@gmail.com>',
            to: email,
            subject: 'Back-end Lessons,',
            html: ` <h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                    </p>`
        })
        return info.accepted.length > 0;
    }

    async sendPassword(email: string, code: string): Promise<boolean> {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'test.api.incub@gmail.com',
                pass: 'tovolmjhfzprftkl'
            }
        });
        let info = await transport.sendMail({
            from: 'Maxim <test.api.incub@gmail.com>',
            to: email,
            subject: 'Back-end Lessons,',
            html: `  <h1>Password recovery</h1>
                     <p>To finish password recovery please follow the link below:
                     <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                     </p>`
        })
        return info.accepted.length > 0;
    }
}

