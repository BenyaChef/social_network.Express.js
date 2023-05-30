import {body} from "express-validator";
import {ERRORS_MESSAGE} from "../enum/errors-validation-messages";
const patternUrl = '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'

const loginOrEmailValidationRule = body('loginOrEmail')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)


const passwordValidationRule =  body('password')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min:6, max: 20}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const loginValidationRule = body('login')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 10}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches('^[a-zA-Z0-9_-]*$').withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const emailValidationRule = body('email')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 6, max: 20}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .isEmail().withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const nameValidationRule = body('name')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 15}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const descriptionValidationRule = body('description')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 500}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const websiteUrlValidationRule = body('websiteUrl')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 100}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches(patternUrl).withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const titleValidationRule = body('title')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 30}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const shortDescriptionValidationRule = body('shortDescription')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 100}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const contentValidationRule = body('content')
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .trim()
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isLength({min: 3, max: 1000}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

export const authValidationMiddleware = [loginOrEmailValidationRule, passwordValidationRule]
export const userValidationMiddleware = [loginValidationRule, passwordValidationRule, emailValidationRule]
export const blogValidationMiddleware = [nameValidationRule, descriptionValidationRule, websiteUrlValidationRule]
export const postValidationMiddleware = [titleValidationRule, shortDescriptionValidationRule, contentValidationRule]