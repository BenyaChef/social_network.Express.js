import express from 'express';
import {blogRouter} from "./routes/router-blogs";
import {postRouter} from "./routes/router-posts";
import {testRouter} from "./routes/router-testing";

export const app = express()
const port = process.env.PORT || 3003

app.use(express.json())

// app.use('/testing', testRouter)
app.use('/blog', blogRouter)
app.use('/post', postRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})