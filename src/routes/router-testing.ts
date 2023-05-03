import {Request, Response, Router} from "express";

export const testingRouter = Router({})

testingRouter.get('/all-data', (req: Request, res: Response) => {
    res.status(200).send("All data delete!")
})