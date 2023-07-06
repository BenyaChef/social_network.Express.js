import "reflect-metadata";
import {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/request-models/request-types";
import {UserInputModel} from "../models/users-model/user-input-model";

import {HTTP_STATUS} from "../enum/enum-HTTP-status";

import {UsersPaginationSortQueryModel} from "../models/request-models/users-pagination-sort-model";
import {UsersViewPaginationSortModel} from "../models/users-model/users-view-pagination-sort-model";
import {ObjectId} from "mongodb";
import {mapUsers} from "../utils/helpers/map-users";
import {UsersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {UsersService} from "../domain/users-service";
import {inject, injectable} from "inversify";


@injectable()
export class UsersController {
    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(UsersService) protected usersService: UsersService) {
    }

    async getAllUsers(req: RequestWithQuery<UsersPaginationSortQueryModel>,
                      res: Response<UsersViewPaginationSortModel>) {
        res.status(HTTP_STATUS.OK).send(await this.usersQueryRepository.getAllUsers(req.query))
    }

    async createAdminUser(req: RequestWithBody<UserInputModel>,
                          res: Response) {
        const newUserId: ObjectId = await this.usersService.createAdminUser(req.body)

        const newUser = await this.usersQueryRepository.findUserById(newUserId)
        if (!newUser) {
            return res.sendStatus(HTTP_STATUS.Not_found)
        }
        return res.status(HTTP_STATUS.Created).send(mapUsers(newUser))
    }

    async deleteUsersById(req: RequestWithParams<{ id: string }>,
                          res: Response) {
        const isDelete: boolean = await this.usersService.deleteUsersById(req.params.id)
        if (!isDelete) return res.sendStatus(HTTP_STATUS.Not_found)
        return res.sendStatus(HTTP_STATUS.No_content)
    }
}
