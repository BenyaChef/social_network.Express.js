"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const express_1 = require("express");
const blogsDB_1 = require("../db/blogsDB");
const postDB_1 = require("../db/postDB");
exports.testRouter = (0, express_1.Router)({});
exports.testRouter.delete('/all-data', (req, res) => {
    blogsDB_1.blogsDB.splice(0);
    postDB_1.postDB.splice(0);
    res.sendStatus(204);
});
