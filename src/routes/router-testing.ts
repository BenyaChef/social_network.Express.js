import {Request, Response, Router} from "express";
import {
    DevicesModel,
    BlogsModel,
    CommentsModel,
    EmailsModel,
    PostsModel,
    UsersModel,
    RequestCountsModel, LikesModel
} from "../db/db";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";


export const testRouter = Router({})

testRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        BlogsModel.deleteMany({}),
        PostsModel.deleteMany({}),
        UsersModel.deleteMany({}),
        CommentsModel.deleteMany({}),
        EmailsModel.deleteMany({}),
        RequestCountsModel.deleteMany({}),
        DevicesModel.deleteMany({}),
        LikesModel.deleteMany({})
    ]).catch((error) => {
        console.log(error)
        return res.sendStatus(HTTP_STATUS.Server_error)
    })

    return res.sendStatus(HTTP_STATUS.No_content)
})

