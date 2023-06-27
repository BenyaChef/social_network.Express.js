import mongoose from "mongoose";
import {BlogModel} from "../../models/blogs-models/blog-model";
import {WithId} from "mongodb";

export const BlogsSchema = new mongoose.Schema<WithId<BlogModel>>({
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: String, required: false},
    isMembership: {type: Boolean, require: true}
})