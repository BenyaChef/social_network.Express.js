import express from 'express';
import dotenv from 'dotenv'
import {runDB} from "./db/db";
import {testRouter} from "./routes/router-testing";

dotenv.config()

export const app = express()
const port = process.env.PORT || 3003

app.use('/testing', testRouter)

const starApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

starApp();