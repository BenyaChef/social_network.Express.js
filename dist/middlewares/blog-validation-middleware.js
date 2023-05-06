"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const allBodyValues = ['name', 'description', 'websiteUrl'];
const [name, description, websiteUrl] = allBodyValues;
exports.blogValidationMiddleware = [
    (0, express_validator_1.body)(allBodyValues).isString().trim().withMessage('incorrect type input value'),
    (0, express_validator_1.body)(name)
        .exists()
        .withMessage('name is not defined')
        .isLength({ min: 3, max: 15 })
        .withMessage('length field name is incorrect'),
    (0, express_validator_1.body)(description)
        .exists()
        .withMessage('description is not defined')
        .isLength({ min: 3, max: 500 })
        .withMessage('length field description is incorrect'),
    (0, express_validator_1.body)(websiteUrl)
        .exists()
        .withMessage('webURL is not defined')
        .isLength({ min: 3, max: 100 }).withMessage('URL length is incorrect')
        .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
        .withMessage('incorrect URL address')
];
