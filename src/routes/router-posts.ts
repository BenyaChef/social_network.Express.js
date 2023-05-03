import {Request, Response, Router} from "express";

export const postRouter = Router({})

postRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send("This is posts")
})
postRouter.get('/:id', (req: Request, res: Response) => {
    res.status(200).send("This is post № 1!")
})