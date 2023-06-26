

export interface CreatePostModel {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | undefined,
    createdAt: string
}