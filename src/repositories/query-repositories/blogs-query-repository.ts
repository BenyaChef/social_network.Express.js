import {BlogViewModel} from "../../models/blogs-models/blog-view-model";
import {BlogModel} from "../../models/blogs-models/blog-model";
import {blogsCollections} from "../../db/db";
import {mapBlogs} from "../../utils/helpers/map-blogs";
import {ObjectId} from "mongodb";
import {PaginationSortQueryModel} from "../../models/request-models/pagination-sort-query-model";
import {BlogsViewSortPaginationModel} from "../../models/blogs-models/blogs-view-sort-pagin-model";

export const blogsQueryRepository = {

    async getAllBlogs(query: PaginationSortQueryModel): Promise<BlogsViewSortPaginationModel> {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = query

        const arrBlogs: BlogModel[] = await blogsCollections.find({}).toArray()
        return {
            pagesCount: 1,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: arrBlogs.map(blog => mapBlogs(blog))
        }
    },

    async findBlogByID(id: string | ObjectId): Promise<BlogViewModel | boolean> {
        const isFind: BlogModel | null = await blogsCollections.findOne({_id: new ObjectId(id)})
        if (!isFind) return false
        return mapBlogs(isFind);
    }
}