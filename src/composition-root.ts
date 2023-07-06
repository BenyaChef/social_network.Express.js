import "reflect-metadata";
import {Container} from "inversify";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./controller/blogs-controller";
import {BlogsQueryRepository} from "./repositories/query-repositories/blogs-query-repository";
import {PostsQueryRepository} from "./repositories/query-repositories/posts-query-repository";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./controller/posts-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {UsersQueryRepository} from "./repositories/query-repositories/users-query-repository";
import {CommentsQueryRepository} from "./repositories/query-repositories/comments-query-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentController} from "./controller/comment-controller";
import {UsersRepository} from "./repositories/users-repository";
import {EmailAdapter} from "./adapters/email-adapter";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./controller/users-controller";
import {JwtService} from "./application/jwt-service";
import {DeviceRepository} from "./repositories/device-repository";
import {DeviceQueryRepository} from "./repositories/query-repositories/device-query-repository";
import {DevicesService} from "./domain/devices-service";
import {DevicesController} from "./controller/devices-controller";
import {AuthController} from "./controller/auth-controller";




// const jwtService = new JwtService()
// const emailAdapter = new EmailAdapter()
//
// const deviceQueryRepository = new DeviceQueryRepository()
// const deviceRepository = new DeviceRepository()
// const commentsQueryRepository = new CommentsQueryRepository()
// const commentsRepository = new CommentsRepository()
// const usersQueryRepository = new UsersQueryRepository()
// const usersRepository = new UsersRepository()
// const postsQueryRepository = new PostsQueryRepository()
// const postsRepository = new PostsRepository()
// const blogsQueryRepository= new BlogsQueryRepository()
// const blogsRepository = new BlogsRepository()

// const usersService = new UsersService(usersQueryRepository, usersRepository, emailAdapter)
// const devicesService = new DevicesService(jwtService, deviceRepository, usersQueryRepository, usersService, deviceQueryRepository)
// const blogsService = new BlogsService(blogsRepository)
// const postsService = new PostsService(postsRepository, blogsQueryRepository)
// const commentsService = new CommentsService(usersQueryRepository, postsQueryRepository, commentsRepository, commentsQueryRepository)

// export const blogsController = new BlogsController(blogsQueryRepository, blogsService, postsQueryRepository, postsService)
// export const postsController = new PostsController(postsQueryRepository, postsService)
// export const commentController = new CommentController(commentsQueryRepository, commentsService)
// export const usersController = new UsersController(usersQueryRepository, usersService)
// export const devicesController = new DevicesController(jwtService, deviceQueryRepository, devicesService)
// export const authController = new AuthController(usersService, devicesService, usersQueryRepository)

export const container = new Container()


container.bind(JwtService).to(JwtService)
container.bind(EmailAdapter).to(EmailAdapter)

container.bind(DeviceQueryRepository).to(DeviceQueryRepository)
container.bind(DeviceRepository).to(DeviceRepository)
container.bind(DevicesService).to(DevicesService)
container.bind(DevicesController).to(DevicesController)

container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentController).to(CommentController)

container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersService).to(UsersService)
container.bind(UsersController).to(UsersController)
container.bind(AuthController).to(AuthController)

container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsService).to(PostsService)
container.bind(PostsController).to(PostsController)

container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsController).to(BlogsController)









