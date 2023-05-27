import {SortDirectionEnum} from "../../enum/sort-direction";
import {SortByEnum} from "../../enum/sort-by-enum";

export interface BlogsPaginationSortQueryModel {
    searchNameTerm?: string | null
    sortBy?: SortByEnum
    sortDirection?: SortDirectionEnum
    pageNumber?: number
    pageSize?: number
}