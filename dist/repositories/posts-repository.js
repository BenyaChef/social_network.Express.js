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
exports.postsRepository = void 0;
const db_1 = require("./db");
const mapPosts_1 = require("../mapPosts");
const mongodb_1 = require("mongodb");
const find_blogID_1 = require("../utils/helpers/find-blogID");
exports.postsRepository = {
    getAllPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const postsArr = yield db_1.postsCollections.find({}).toArray();
            return postsArr.map(post => (0, mapPosts_1.mapPosts)(post));
        });
    },
    findPostByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFind = yield db_1.postsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!isFind)
                return false;
            return (0, mapPosts_1.mapPosts)(isFind);
        });
    },
    createNewPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = {
                _id: new mongodb_1.ObjectId(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: yield (0, find_blogID_1.findBlogID)(body.blogId),
                createdAt: new Date().toISOString()
            };
            yield db_1.postsCollections.insertOne(newPost);
            return (0, mapPosts_1.mapPosts)(newPost);
        });
    },
    updatePostByID(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const findPost = yield db_1.postsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                    blogName: yield (0, find_blogID_1.findBlogID)(body.blogId)
                }
            });
            return findPost.matchedCount === 1;
        });
    },
    deletePostByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDelete = yield db_1.postsCollections.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (isDelete.deletedCount === 1) {
                const isFind = yield db_1.blogsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!isFind)
                    return true;
            }
            return false;
        });
    }
};
