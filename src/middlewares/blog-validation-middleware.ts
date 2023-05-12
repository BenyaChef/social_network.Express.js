import {body} from "express-validator";


const allBodyValues = ['name', 'description', 'websiteUrl']
const [name, description, websiteUrl] = allBodyValues

export const blogValidationMiddleware = [
    body(allBodyValues).isString().trim().withMessage('incorrect type input value'),
    body(name)
        .exists()
        .withMessage('name is not defined')
        .isLength({min:3, max: 15})
        .withMessage('length field name is incorrect'),
    body(description)
        .exists()
        .withMessage('description is not defined')
        .isLength({min:3, max: 500})
        .withMessage('length field description is incorrect'),
    body(websiteUrl)
        .exists()
        .withMessage('webURL is not defined')
        .isLength({min: 3, max: 100}).withMessage('URL length is incorrect')
        .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
        .withMessage('incorrect URL address')
]