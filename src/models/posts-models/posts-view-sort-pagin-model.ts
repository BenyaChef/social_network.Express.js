
import {PostViewModel} from "./PostViewModel";

export interface PostsViewSortPaginationModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}