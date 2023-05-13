import {param} from "express-validator";

export const idValidationMiddleware = [
    param('id').matches("^[0-9a-fA-F]{24}$")
]