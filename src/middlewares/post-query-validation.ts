import {body, param} from "express-validator";
import {blogsRepository} from "../repositories/blogs-repository";
import {ObjectId} from "mongodb";


const allBodyValues: string[] = ['title', 'shortDescription', 'content', 'blogId']
const [title, shortDescription, content] = allBodyValues

export const postQueryValidationMiddleware = [
    param('id')
        .exists().withMessage('blogId is not defined')
        .matches("^[0-9a-fA-F]{24}$").withMessage('blog id is incorrect value')
        .isString().withMessage('incorrect type input value')
        .trim()
        .custom(async value => {
            if (ObjectId.isValid(value)) {
                const isFind = await blogsRepository.findBlogByID(value)
                if (!isFind) {
                    throw new Error('blog with this id was not found')
                }
                return true
            }
            return false
        }),
    body(title)
        .exists().withMessage('title is not defined')
        .isString().withMessage('incorrect type input value')
        .trim()
        .isLength({min: 3, max: 30}).withMessage('length field title is incorrect'),
    body(shortDescription)
        .exists().withMessage('shortDescription is not defined')
        .isString().withMessage('incorrect type input value')
        .trim()
        .isLength({min: 3, max: 100}).withMessage('length field shortDescription is incorrect'),
    body(content)
        .exists().withMessage('content is not defined')
        .isString().withMessage('incorrect type input value')
        .trim()
        .isLength({min: 3, max: 1000}).withMessage('length field content is incorrect'),

]