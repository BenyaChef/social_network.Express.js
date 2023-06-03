import express from "express";
import {testRouter} from "./routes/router-testing";
import {blogRouter} from "./routes/router-blogs";
import {postRouter} from "./routes/router-posts";
import {loginRouter} from "./routes/router-login";
import {usersRouter} from "./routes/router-users";
import {commentsRouter} from "./routes/router-comments";

export const app = express()
app.use(express.json())

app.use('/testing', testRouter)

app.use('/blogs', blogRouter)
app.use('/posts', postRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)

app.use('/auth', loginRouter)