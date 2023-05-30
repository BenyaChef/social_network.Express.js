import {body} from "express-validator";
import {ERRORS_MESSAGE} from "../enum/errors-validation-messages";
const patternUrl = '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'

const loginOrEmailValidationRule = body('loginOrEmail')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)

const passwordValidationRule =  body('password')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min:6, max: 20}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const loginValidationRule = body('login')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 3, max: 10}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches('^[a-zA-Z0-9_-]*$').withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const emailValidationRule = body('email')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 6, max: 20}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .isEmail().withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const nameValidationRule = body('name')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 3, max: 15}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const descriptionValidationRule = body('description')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 3, max: 500}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const websiteUrlValidationRule = body('websiteUrl')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 3, max: 100}).withMessage(ERRORS_MESSAGE.IS_LENGTH)
    .matches(patternUrl).withMessage(ERRORS_MESSAGE.PATTERN_INCORRECT)

const titleValidationRule = body('title')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 3, max: 30}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const shortDescriptionValidationRule = body('shortDescription')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 3, max: 100}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

const contentValidationRule = body('content')
    .notEmpty().withMessage(ERRORS_MESSAGE.NOT_EMPTY)
    .isString().withMessage(ERRORS_MESSAGE.IS_STRING)
    .isLength({min: 3, max: 1000}).withMessage(ERRORS_MESSAGE.IS_LENGTH)

export const authValidationMiddleware = [loginOrEmailValidationRule, passwordValidationRule]
export const userValidationMiddleware = [loginValidationRule, passwordValidationRule, emailValidationRule]
export const blogValidationMiddleware = [nameValidationRule, descriptionValidationRule, websiteUrlValidationRule]
export const postValidationMiddleware = [titleValidationRule, shortDescriptionValidationRule, contentValidationRule]