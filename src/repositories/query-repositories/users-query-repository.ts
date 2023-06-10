import {UsersViewPaginationSortModel} from "../../models/users-model/users-view-pagination-sort-model";
import {UsersPaginationSortQueryModel} from "../../models/request-models/users-pagination-sort-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {emailCollections, usersCollections} from "../../db/db";
import {AdminDbModel} from "../../models/users-model/admin-db-model";
import {mapUsers} from "../../utils/helpers/map-users";
import {UserViewModel} from "../../models/users-model/user-view-model";
import {ObjectId} from "mongodb";
import {MeViewModel} from "../../models/users-model/me-view-model";
import {mapMeUser} from "../../utils/map-me-user";
import {EmailResending} from "../../models/email-model.ts/email-confirmation-model";
import {LoginInputModel} from "../../models/login-models/login-input-model";
import {UserInputModel} from "../../models/users-model/user-input-model";



export const usersQueryRepository = {

    async findUserEmail(body: EmailResending) {
        return await emailCollections.findOne({email: body.email})
    },

    async findUserLoginOrEmail(body: LoginInputModel | UserInputModel): Promise<AdminDbModel | null> {
        let filter = {}
        if ('loginOrEmail' in body) {
            filter = {$or: [{login: body.loginOrEmail}, {email: body.loginOrEmail}]}
        } else {
            filter = {$or: [{login: body.login}, {email: body.email}]}
        }
        return await usersCollections.findOne(filter)
    },

    async getUserByIdByToken(id: ObjectId): Promise<MeViewModel | null> {
        const findUser = await usersCollections.findOne({_id: new ObjectId(id)})
        if (!findUser) {
            return null
        }
        return mapMeUser(findUser)
    },

    async findUserById(id: string | ObjectId): Promise<UserViewModel | null> {
        const findUser = await usersCollections.findOne({_id: new ObjectId(id)})
        if (!findUser) {
            return null
        }
        return mapUsers(findUser)
    },

    async getAllUsers(query: UsersPaginationSortQueryModel): Promise<UsersViewPaginationSortModel> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {searchEmailTerm, searchLoginTerm, sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const searchEmail = searchEmailTerm !== null ? {email: {$regex: searchEmailTerm, $options: "ix"}} : {}
        const searchLogin = searchLoginTerm !== null ? {login: {$regex: searchLoginTerm, $options: 'ix'}} : {}

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, searchEmail, searchLogin)
        const {skipPage, totalCount, pagesCount} = processingResult

        const arrUsers: AdminDbModel[] = await usersCollections
            .find({$or: [searchEmail, searchLogin]})
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .toArray()
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: arrUsers.map(mapUsers)
        }
    },

    _aggregationOfQueryParameters: (query: UsersPaginationSortQueryModel): Required<UsersPaginationSortQueryModel> => {
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