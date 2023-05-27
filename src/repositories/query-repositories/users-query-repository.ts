import {UsersViewPaginationSortModel} from "../../models/users-model/users-view-pagination-sort-model";
import {UsersPaginationSortQueryModel} from "../../models/request-models/users-pagination-sort-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {usersCollections} from "../../db/db";
import {UsersDBModel} from "../../models/users-model/users-db-model";
import {mapUsers} from "../../utils/helpers/map-users";

export const usersQueryRepository = {

    async getAllUsers(query: UsersPaginationSortQueryModel): Promise<UsersViewPaginationSortModel> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {searchEmailTerm, searchLoginTerm, sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const searchEmail = searchEmailTerm !== null ? {email: {$regex: searchEmailTerm, $options: "ix"}} : {}
        const searchLogin = searchLoginTerm !== null ? {login: {$regex: searchLoginTerm, $options: 'ix'}} : {}

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, searchEmail, searchLogin)
        const {skipPage, totalCount, pagesCount} = processingResult

        const arrUsers: UsersDBModel[] = await usersCollections
            .find({$or: [searchEmail, searchLogin]})
            .sort({[sortBy]: sortDirection!})
            .limit(+pageSize!)
            .skip(skipPage)
            .toArray()
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: arrUsers.map(user => mapUsers(user))
        }
    },

    _aggregationOfQueryParameters: (query: UsersPaginationSortQueryModel) : Required<UsersPaginationSortQueryModel> => {
        const paramSortPagination = {
            searchEmailTerm: query.searchEmailTerm || null,
            searchLoginTerm: query.searchLoginTerm || null,
            sortBy: query.sortBy || SortByEnum.createdAt,
            sortDirection: query.sortDirection || SortDirectionEnum.desc,
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return paramSortPagination
    },

    _processingPagesAndNumberOfDocuments: async (pageNumber: number, pageSize: number, searchParamOne: object, searchParamTwo: object) => {
      const skipPage = (pageNumber - 1) * pageSize
      const totalCount = await usersCollections.countDocuments({$or: [searchParamOne, searchParamTwo]})
      const pagesCount = Math.ceil(totalCount / pageSize)
      return {
          skipPage,
          totalCount,
          pagesCount
      }
  }
}