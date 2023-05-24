import {SortByEnum} from "../../enum/sort-by-enum";
import {SortDirectionEnum} from "../../enum/sort-direction";

export interface UsersPaginationSortQueryModel {
    sortBy?: SortByEnum
    sortDirection?: SortDirectionEnum
    pageNumber?: number
    pageSize?: number
    searchEmailTerm?: string | null
    searchLoginTerm?: string | null
}