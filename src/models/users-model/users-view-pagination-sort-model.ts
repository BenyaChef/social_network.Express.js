import {UserViewModel} from "./user-view-model";

export interface UsersViewPaginationSortModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserViewModel[]
}