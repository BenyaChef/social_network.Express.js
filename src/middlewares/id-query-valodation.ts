import {ObjectId} from "mongodb";
import {blogsRepository} from "../repositories/blogs-repository";
import {param} from "express-validator";

export const idQueryValidationMiddleware = [
param('id').custom(async value => {
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