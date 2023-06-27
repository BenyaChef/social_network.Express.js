export class AdminClass {
    createdAt: string

    constructor(public login: string, public email: string, public password: string) {
        this.createdAt = new Date().toISOString()
    }
}