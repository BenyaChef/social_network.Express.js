"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const blogsDB_1 = require("../db/blogsDB");
const postDB_1 = require("../db/postDB");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => {
    blogsDB_1.blogsDB.splice(0);
    postDB_1.postDB.splice(0);
    res.status(204).send("All data is delete!");
});
