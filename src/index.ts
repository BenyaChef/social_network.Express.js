import express from 'express';
import {blogRouter} from "./routes/router-blogs";
import {postRouter} from "./routes/router-posts";
import {testRouter} from "./routes/router-testing";
import dotenv from 'dotenv'
import {runDB} from "./repositories/db";

dotenv.config()


export const app = express()
const port = process.env.PORT || 3003

app.use(express.json())

app.use('/testing', testRouter)
app.use('/blogs', blogRouter)
app.use('/posts', postRouter)

const starApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

starApp();