import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./controller/blogs-controller";
import {BlogsQueryRepository} from "./repositories/query-repositories/blogs-query-repository";

const blogsQueryRepository= new BlogsQueryRepository()
const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsQueryRepository, blogsService)