import dotenv from 'dotenv'
import {runDB} from "./db/db";
import {app} from "./setting";

dotenv.config()

const port = process.env.PORT || 3003

const starApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

starApp();