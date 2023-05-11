"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const postDB_1 = require("../db/postDB");
const create_new_id_1 = require("../utils/helpers/create-new-id");
const find_blogID_1 = require("../utils/helpers/find-blogID");
exports.postsRepository = {
    getAllPost() {
        return postDB_1.postDB;
    },
    findPostByID(id) {
        return postDB_1.postDB.find(p => p.id === id);
    },
    createNewPost(body) {
        const newPost = {
            id: (0, create_new_id_1.createNewId)(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: (0, find_blogID_1.findBlogID)(body.blogId)
        };
        postDB_1.postDB.push(newPost);
        return newPost;
    },
    updatePostByID(id, body) {
        const findPost = postDB_1.postDB.find(p => p.id === id);
        if (findPost) {
            findPost.title = body.title;
            findPost.shortDescription = body.shortDescription;
            findPost.content = body.content;
            findPost.blogId = body.blogId;
            findPost.blogName = (0, find_blogID_1.findBlogID)(body.blogId);
            return true;
        }
        return false;
    },
    deletePostByID(id) {
        for (let i = 0; i < postDB_1.postDB.length; i++) {
            if (postDB_1.postDB[i].id === id) {
                postDB_1.postDB.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
