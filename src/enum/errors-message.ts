export const ErrorsMessages = {
    errorsMessages: [
        {
            message: "user already exists with this data",
            field: "email"
        }
    ]
}

export const CodeIncorrectMessage = {
    errorsMessages: [
        {
            message: "confirmation code is incorrect",
            field: "code"
        }
    ]
}

export const ExpiredCodeMessage = {
    errorsMessages: [
        {
            message: "code has expired",
            field: "expirationDate"
        }
    ]
}

export const EmailConfirmed = {
    errorsMessages: [
        {
            message: "email confirmed",
            field: "email"
        }
    ]
}

export const EmailNotFound = {
    errorsMessages: [
        {
            message: "email no found",
            field: "email"
        }
    ]
}

export enum MessagesEnum {
    registration = 'The user has been created, an email confirmation email has been sent to your email address',
    verified = 'Email was verified. Account was activated'
}
