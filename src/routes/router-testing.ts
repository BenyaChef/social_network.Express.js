import {Request, Response, Router} from "express";
import {blogsCollections, postsCollections, usersCollections} from "../db/db";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";


export const testRouter = Router({})

testRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        blogsCollections.deleteMany({}),
        postsCollections.deleteMany({}),
        usersCollections.deleteMany({})
    ]).catch((error) => {
            console.log(error)
            return res.sendStatus(HTTP_STATUS.Server_error)
        })

    return res.sendStatus(HTTP_STATUS.No_content)
})