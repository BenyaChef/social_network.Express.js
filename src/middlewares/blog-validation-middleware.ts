import {body} from "express-validator";

export const blogValidationMiddleware = [
    body('name').exists().withMessage('name is not defined').isString().trim().isLength({min:3, max: 15}).withMessage('length field name is incorrect'),
    body('description').exists().withMessage('description is not defined').isString().trim().isLength({min:3, max: 15}).withMessage('length field description is incorrect')
]