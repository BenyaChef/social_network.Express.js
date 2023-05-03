import {Request, Response, Router} from "express";

export const blogRouter = Router({})

blogRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send("This is blogs!")
})
blogRouter.get('/:id', (req: Request, res: Response) => {
    res.status(200).send("This is blog № 1! ")
})

