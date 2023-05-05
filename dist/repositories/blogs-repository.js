"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const blogsDB_1 = require("../db/blogsDB");
const create_new_id_1 = require("../create-new-id");
exports.blogsRepository = {
    getAllBlogs() {
        return blogsDB_1.blogsDB;
    },
    findBlogByID(id) {
        return blogsDB_1.blogsDB.find(b => b.id === id);
    },
    createNewBlog(body) {
        const newBlog = {
            id: (0, create_new_id_1.createNewId)(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        };
        blogsDB_1.blogsDB.push(newBlog);
        return newBlog;
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
