import {BlogViewModel} from "./blog-view-model";

export interface BlogsViewSortPaginationModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}