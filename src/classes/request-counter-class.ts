export class RequestCounter {
    createdAt: Date
    constructor(public ip: string,
                public URL: string,
                public method: string) {
        this.createdAt = new Date()
    }
}