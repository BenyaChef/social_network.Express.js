import {SortDirectionEnum} from "../../enum/sort-direction";

export interface PostsPaginationSortQueryModel {
    sortBy?: string
    sortDirection?: SortDirectionEnum
    pageNumber?: number
    pageSize?: number
}