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
const blogsDB_1 = require("../db/blogsDB");
const create_new_id_1 = require("../utils/helpers/create-new-id");
const db_1 = require("./db");
exports.blogsRepository = {
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.client.db('blogs-and-posts').collection('blogs').find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    findBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.client.db('blogs-and-posts').collection('blogs').find({ id: id }, { projection: { _id: 0 } }).toArray();
        });
    },
    createNewBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: (0, create_new_id_1.createNewId)(),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            };
            yield db_1.client.db('blogs-and-posts').collection('blogs').insertOne(newBlog);
            return newBlog;
        });
    },
    updateBlogByID(id, body) {
        const foundBlog = blogsDB_1.blogsDB.find(b => b.id === id);
        if (foundBlog) {
            foundBlog.name = body.name;
            foundBlog.description = body.description;
            foundBlog.websiteUrl = body.websiteUrl;
            return true;
        }
        return false;
    },
    deleteBlogByID(id) {
        for (let i = 0; i < blogsDB_1.blogsDB.length; i++) {
            if (blogsDB_1.blogsDB[i].id === id) {
                blogsDB_1.blogsDB.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
