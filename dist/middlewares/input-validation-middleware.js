"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errorsMessages: errors.array({ onlyFirstError: true })
                .map(e => {
                return {
                    message: e.msg,
                    field: e.type === 'field' ? e.path : null
                };
            })
        });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
