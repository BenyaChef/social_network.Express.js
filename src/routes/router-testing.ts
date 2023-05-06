import {Request, Response, Router} from "express";
import {blogsDB} from "../db/blogsDB";
import {postDB} from "../db/postDB";


export const testRouter = Router({})

testRouter.delete('/all-data', (req: Request, res: Response) => {
    blogsDB.splice(0)
    postDB.splice(0)
    res.sendStatus(204)
})