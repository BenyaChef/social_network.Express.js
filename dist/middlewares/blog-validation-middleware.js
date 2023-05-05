"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.blogValidationMiddleware = [
    (0, express_validator_1.body)('name').exists().withMessage('name is not defined').isString().trim().isLength({ min: 3, max: 15 }).withMessage('length field name is incorrect'),
    (0, express_validator_1.body)('description').exists().withMessage('description is not defined').isString().trim().isLength({ min: 3, max: 15 }).withMessage('length field description is incorrect')
];
