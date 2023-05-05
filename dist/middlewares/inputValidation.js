"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidation = void 0;
const express_validator_1 = require("express-validator");
const inputValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errorsMessages: errors.array()
        });
    }
    else {
        next();
    }
};
exports.inputValidation = inputValidation;
