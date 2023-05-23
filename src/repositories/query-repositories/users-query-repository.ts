import {UsersViewPaginationSortModel} from "../../models/users-model/users-view-pagination-sort-model";
import {UsersPaginationSortQueryModel} from "../../models/request-models/users-pagination-sort-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {usersCollections} from "../../db/db";
import {UsersDBModel} from "../../models/users-model/users-db-model";
import {mapUsers} from "../../utils/helpers/map-users";

export const usersQueryRepository = {

    async getAllUsers(query: UsersPaginationSortQueryModel): Promise<UsersViewPaginationSortModel> {
        const queryResult = await this._paginationAndSortToQueryParam(query)
        const searchEmail = {$regex: queryResult.searchEmailTerm, $options: "ix"}
        const searchLogin = {$regex: queryResult.searchLoginTerm, $options: 'ix'}
        const arrUsers: UsersDBModel[] = await usersCollections
            .find({$or: [{email: searchEmail}, {login: searchLogin}]})
            .sort({[queryResult.sortBy]: queryResult.sortDirection})
            .limit(+queryResult.pageSize)
            .skip(queryResult.skipPage)
            .toArray()
        return {
            pagesCount: queryResult.pagesCount,
            page: +queryResult.pageNumber,
            pageSize: +queryResult.pageSize,
            totalCount: queryResult.totalCount,
            items: arrUsers.map(user => mapUsers(user))
        }
    },

    _paginationAndSortToQueryParam: async (query: UsersPaginationSortQueryModel) => {
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = query
        const paramSortPagination: UsersPaginationSortQueryModel = {
            searchEmailTerm: searchEmailTerm || '',
            searchLoginTerm: searchLoginTerm || '',
            sortBy: sortBy || SortByEnum.createdAt,
            sortDirection: sortDirection || SortDirectionEnum.desc,
            pageNumber: pageNumber || 1,
            pageSize: pageSize || 10
        }

        const searchEmail = {$regex: searchEmailTerm, $options: "ix"}
        const searchLogin = {$regex: searchLoginTerm, $options: 'ix'}
        const skipPage = (paramSortPagination.pageNumber - 1) * paramSortPagination.pageSize
        const totalCount = await usersCollections.countDocuments({$or: [{email: searchEmail}, {login: searchLogin}]})
        const pagesCount = Math.ceil(totalCount / paramSortPagination.pageSize)
        return {
            ...paramSortPagination,
            skipPage,
            totalCount,
            pagesCount
        }

    }
}