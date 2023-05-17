import {RequestWithParams} from "../models/request-models/RequestTypes";
import {PostViewModel} from "../models/posts-models/PostViewModel";
import {Response, Request} from "express";
import {HTTP_STATUS} from "../enum/enum-HTTP-status";
import {postsService} from "../domain/posts-service";
import {blogsService} from "../domain/blogs-service";
import {BlogViewModel} from "../models/blogs-models/BlogViewModel";

export const blogsController = {
   async getAllBlogs(req: Request, res: Response<BlogViewModel[]>) {
       res.status(HTTP_STATUS.OK).send(await blogsService.getAllBlogs())
   }
}