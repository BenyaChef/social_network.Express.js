export class BlogsClass {
    createdAt: string
    isMembership: boolean
    constructor(public name: string, public description: string, public websiteUrl: string) {

        this.createdAt = new Date().toISOString()
        this.isMembership = false
    }
}