import express from "express";
import {blogRouter} from "./routes/router-blogs";
import {postRouter} from "./routes/router-posts";

export const app = express()

app.use(express.json())


app.use('/blogs', blogRouter)
app.use('/posts', postRouter)
