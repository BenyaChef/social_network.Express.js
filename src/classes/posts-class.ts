export class PostsClass {
    createdAt: string

    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string) {

        this.createdAt = new Date().toISOString()
    }
}