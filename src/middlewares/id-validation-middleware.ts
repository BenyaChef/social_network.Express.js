import {param} from "express-validator";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/blogs-repository";

export const idValidationMiddleware = [
    param('id').matches("^[0-9a-fA-F]{24}$").custom(async value => {
        if (ObjectId.isValid(value)) {
            const isFind = await blogsRepository.findBlogByID(value)
            if (!isFind) {
                throw new Error('blog with this id was not found')
            }
            return true
        }
        return false
    })
]