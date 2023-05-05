"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const authorizationMiddleware = (req, res, next) => {
    const basic64 = Buffer.from('admin:qwerty').toString('base64');
    const loginData = `Basic ${basic64}`;
    if (req.headers.authorization !== loginData)
        res.sendStatus(401);
    next();
};
exports.authorizationMiddleware = authorizationMiddleware;
