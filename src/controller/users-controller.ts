import {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/request-models/request-types";
import {UserInputModel} from "../models/users-model/user-input-model";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {UsersPaginationSortQueryModel} from "../models/request-models/users-pagination-sort-model";
import {UsersViewPaginationSortModel} from "../models/users-model/users-view-pagination-sort-model";
import {ObjectId} from "mongodb";



export const usersController = {

   async getAllUsers(req: RequestWithQuery<UsersPaginationSortQueryModel>,
                     res: Response<UsersViewPaginationSortModel>) {
        res.status(HTTP_STATUS.OK).send(await usersQueryRepository.getAllUsers(req.query))
    },

   async createUser(req: RequestWithBody<UserInputModel>,
                    res: Response) {
        const newUserId: ObjectId = await usersService.createUser(req.body)

       const newUser = await usersQueryRepository.findUserById(newUserId.toString())
       if(!newUser) {
           return res.sendStatus(HTTP_STATUS.Not_found)
       }
       return res.status(HTTP_STATUS.Created).send(newUser)
    },

   async deleteUsersById(req: RequestWithParams<{ id: string }>,
                    res: Response) {
        const isDelete : boolean = await usersService.deleteUsersById(req.params.id)
       if(!isDelete) return res.sendStatus(HTTP_STATUS.Not_found)
       return res.sendStatus(HTTP_STATUS.No_content)
    }
}