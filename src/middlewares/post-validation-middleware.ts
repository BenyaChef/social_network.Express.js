import {body} from "express-validator";
import {blogsRepository} from "../repositories/blogs-repository";

const allBodyValues: Array<string> = ['title', 'shortDescription', 'content', 'blogId']
const [title, shortDescription, content, blogId] = allBodyValues

export const postValidationMiddleware = [
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
    body(blogId)
        .exists().withMessage('blogId is not defined')
        .isString().withMessage('incorrect type input value')
        .trim()
        .custom(value => {return blogsRepository.findBlogByID(value)}).withMessage('there is no blog with this id')
]