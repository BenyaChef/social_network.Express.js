"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidation = void 0;
const express_validator_1 = require("express-validator");
const inputValidation = (req, res, next) => {
    const formatterError = ({ msg, path }) => {
        return {
            message: msg,
            field: path
        };
    };
    const errors = (0, express_validator_1.validationResult)(req).formatWith(formatterError);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errorsMessages: errors.array({ onlyFirstError: true })
        });
    }
    else {
        next();
    }
};
exports.inputValidation = inputValidation;
