import {body} from "express-validator";
import {ERRORS_MESSAGE} from "../enum/errors-messages";

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


export const authValidationMiddleware = [loginOrEmailValidationRule, passwordValidationRule]
export const userValidationMiddleware = [loginValidationRule, passwordValidationRule, emailValidationRule]