import {SortDirectionEnum} from "../../enum/sort-direction";

export interface BlogsPaginationSortQueryModel {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: SortDirectionEnum
    pageNumber: number
    pageSize: number
}