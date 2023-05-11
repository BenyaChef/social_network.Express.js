import {MongoClient, ServerApiVersion} from "mongodb";

const mongoURI = process.env.MONGO_URL || "mongodb+srv://benyaChef:qwerty12345@cluster0.i46rvtu.mongodb.net/?retryWrites=true&w=majority"

export const client = new MongoClient(mongoURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

export async function runDB() {
    try {
        await client.connect();
        await client.db('blogs-and-posts').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch {
        console.log("Can`t connect to db")
        await client.close();
    }
}