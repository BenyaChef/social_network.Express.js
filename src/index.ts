import express, {Request, Response} from 'express';
import {blogRouter} from "./routes/router-blogs";
import {postRouter} from "./routes/router-posts";
import {testingRouter} from "./routes/router-testing";

export const app = express()
const port = process.env.PORT || 3003

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello my friend!')
})

app.use('/blog', blogRouter)
app.use('/post', postRouter)
app.use('/testing', testingRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})