import dotenv from "dotenv";
dotenv.config()

export const settings = {
    MONGO_URI: process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase',
    SECRET_KEY: process.env.SECRET_KEY || 'YOURSECRETKEYGOESHERE'
}