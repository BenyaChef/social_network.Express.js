import {Request, Response, Router} from "express";
import {blogsDB} from "../db/blogsDB";
import {postDB} from "../db/postDB";


export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    blogsDB.splice(0)
    postDB.splice(0)
    res.status(204).send("All data is delete!")
})