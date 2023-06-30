export class CommentClass {
    createdAt: string

    constructor(public content: string,
                public commentatorInfo: {
                    userId: string;
                    userLogin: string;
                },
                public postId: string) {
        this.createdAt = new Date().toISOString()
    }
}