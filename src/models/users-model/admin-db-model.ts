export interface AdminDbModel {
    email: string
    password: string
    login: string
    createdAt: string
    code?: string
    exp?: Date
}