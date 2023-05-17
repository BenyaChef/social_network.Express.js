import {Request, Response, Router} from "express";
import {blogsCollections, postsCollections} from "../db/db";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";


export const testRouter = Router({})

testRouter.delete('/all-data', async (req: Request, res: Response) => {
    const isDelete = await Promise.all([blogsCollections.deleteMany({}), postsCollections.deleteMany({})])
    if (isDelete) {
        res.sendStatus(HTTP_STATUS.No_content)
    }
    res.sendStatus(HTTP_STATUS.Not_found)
})