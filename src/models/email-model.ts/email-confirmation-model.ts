export interface EmailConfirmationModel {
    email: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export interface EmailResending {
    email: string
}

