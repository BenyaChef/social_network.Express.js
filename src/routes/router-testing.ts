import {Request, Response, Router} from "express";
import {blogsDB} from "../db/blogsDB";
import {postDB} from "../db/postDB";


export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    blogsDB.length = 0
    postDB.length = 0
    res.sendStatus(204)
})