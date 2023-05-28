import {ObjectId} from "mongodb";
import {param} from "express-validator";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";

export const idQueryValidationMiddleware = [
param('id').custom(async value => {
    if (ObjectId.isValid(value)) {
        const isFind = await blogsQueryRepository.findBlogByID(value)
        if (!isFind) {
            throw new Error('blog with this id was not found')
        }
        return true
    }
    return false
})
]