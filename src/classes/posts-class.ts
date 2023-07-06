import {LikeModel} from "../models/comment-models/like-model";


export class PostsClass {
    createdAt: string
    likes: LikeModel[]
    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string) {

        this.createdAt = new Date().toISOString()
        this.likes = []
    }
}