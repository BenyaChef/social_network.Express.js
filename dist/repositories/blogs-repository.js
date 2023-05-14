"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
const mapBlogs_1 = require("../mapBlogs");
exports.blogsRepository = {
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const arrBlogs = yield db_1.blogsCollections.find({}).toArray();
            return arrBlogs.map(blog => (0, mapBlogs_1.mapBlogs)(blog));
        });
    },
    findBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFind = yield db_1.blogsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!isFind)
                return false;
            return (0, mapBlogs_1.mapBlogs)(isFind);
        });
    },
    createNewBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                _id: new mongodb_1.ObjectId,
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                isMembership: false,
                createdAt: new Date().toISOString()
            };
            yield db_1.blogsCollections.insertOne(newBlog);
            return (0, mapBlogs_1.mapBlogs)(newBlog);
        });
    },
    updateBlogByID(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFind = yield db_1.blogsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }
            });
            return isFind.matchedCount === 1;
        });
    },
    deleteBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield db_1.blogsCollections.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return isDelete.deletedCount === 1;
        });
    }
};
