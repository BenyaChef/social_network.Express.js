import express from 'express';
import {blogRouter} from "./routes/router-blogs";
import {postRouter} from "./routes/router-posts";
import {testRouter} from "./routes/router-testing";
import dotevn from 'dotenv'

dotevn.config()
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log(process.env.MONGO_URL)
export const app = express()
const port = process.env.PORT || 3003

app.use(express.json())

app.use('/testing', testRouter)
app.use('/blogs', blogRouter)
app.use('/posts', postRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})