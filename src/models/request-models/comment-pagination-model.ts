import {SortDirectionEnum} from "../../enum/sort-direction";

export interface CommentPaginationModel {
    sortBy?: string
    sortDirection?: SortDirectionEnum
    pageNumber?: number
    pageSize?: number
}