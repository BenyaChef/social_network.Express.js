import {CommentViewModel} from "./comment-view-model";

export interface CommentPaginationViewModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}