import "reflect-metadata";
import {UsersViewPaginationSortModel} from "../../models/users-model/users-view-pagination-sort-model";
import {UsersPaginationSortQueryModel} from "../../models/request-models/users-pagination-sort-model";
import {SortByEnum} from "../../enum/sort-by-enum";
import {SortDirectionEnum} from "../../enum/sort-direction";
import {EmailsModel, UsersModel} from "../../db/db";
import {AdminDbModel} from "../../models/users-model/admin-db-model";
import {mapUsers} from "../../utils/helpers/map-users";
import {ObjectId, WithId} from "mongodb";
import {EmailResending} from "../../models/email-model.ts/email-confirmation-model";
import {LoginInputModel} from "../../models/login-models/login-input-model";
import {UserInputModel} from "../../models/users-model/user-input-model";
import {injectable} from "inversify";

@injectable()
export class UsersQueryRepository {
    async findUserByCode(code: string): Promise<WithId<AdminDbModel> | null> {
        return UsersModel.findOne({code: code});
    }

    async findUserEmail(body: EmailResending) {
        return EmailsModel.findOne({email: body.email})
    }

    async findUserByEmail(body: EmailResending) {
        return UsersModel.findOne({email: body.email});
    }

    async findUserLoginOrEmail(body: LoginInputModel | UserInputModel): Promise<WithId<AdminDbModel> | null> {
        let filter = {}
        if ('loginOrEmail' in body) {
            filter = {$or: [{login: body.loginOrEmail}, {email: body.loginOrEmail}]}
        } else {
            filter = {$or: [{login: body.login}, {email: body.email}]}
        }
        return UsersModel.findOne(filter);
    }

    async findUserById(id: ObjectId): Promise<WithId<AdminDbModel> | null> {
        const findUser = await UsersModel.findOne({_id: new ObjectId(id)})
        if (!findUser) {
            return null
        }
        return findUser
    }

    async getAllUsers(query: UsersPaginationSortQueryModel): Promise<UsersViewPaginationSortModel> {
        const aggregationResult = this._aggregationOfQueryParameters(query)
        const {searchEmailTerm, searchLoginTerm, sortBy, sortDirection, pageNumber, pageSize} = aggregationResult

        const searchEmail = searchEmailTerm !== null ? {email: {$regex: searchEmailTerm, $options: "ix"}} : {}
        const searchLogin = searchLoginTerm !== null ? {login: {$regex: searchLoginTerm, $options: 'ix'}} : {}

        const processingResult = await this._processingPagesAndNumberOfDocuments(pageNumber, pageSize, searchEmail, searchLogin)
        const {skipPage, totalCount, pagesCount} = processingResult

        const arrUsers: Array<WithId<AdminDbModel>> = await UsersModel
            .find({$or: [searchEmail, searchLogin]})
            .sort({[sortBy]: sortDirection})
            .limit(+pageSize)
            .skip(skipPage)
            .lean()
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: arrUsers.map(mapUsers)
        }
    }

    _aggregationOfQueryParameters(query: UsersPaginationSortQueryModel): Required<UsersPaginationSortQueryModel> {
        const paramSortPagination = {
            searchEmailTerm: query.searchEmailTerm || null,
            searchLoginTerm: query.searchLoginTerm || null,
            sortBy: query.sortBy || SortByEnum.createdAt,
            sortDirection: query.sortDirection || SortDirectionEnum.desc,
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return paramSortPagination
    }

    async _processingPagesAndNumberOfDocuments(pageNumber: number, pageSize: number, searchParamOne: object, searchParamTwo: object) {
        const skipPage = (pageNumber - 1) * pageSize
        const totalCount = await UsersModel.countDocuments({$or: [searchParamOne, searchParamTwo]})
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            skipPage,
            totalCount,
            pagesCount
        }
    }
}

