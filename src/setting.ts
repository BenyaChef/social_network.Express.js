import express from "express";
import {testRouter} from "./routes/router-testing";
import {blogRouter} from "./routes/router-blogs";
import {postRouter} from "./routes/router-posts";
import {authRouter} from "./routes/router-auth";
import {usersRouter} from "./routes/router-users";
import {commentsRouter} from "./routes/router-comments";
import cookieParser from "cookie-parser";
import {routerSecurityDevices} from "./routes/router-security-devices";

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/testing', testRouter)

app.use('/auth', authRouter)
app.use('/blogs', blogRouter)
app.use('/posts', postRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/security', routerSecurityDevices)
