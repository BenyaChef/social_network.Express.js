import {Request, Response, Router} from "express";
import {blogsCollections, postsCollections} from "../repositories/db";


export const testRouter = Router({})

testRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsCollections.deleteMany({})
    await postsCollections.deleteMany({})
    return res.sendStatus(204)
})