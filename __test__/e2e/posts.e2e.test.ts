import request from "supertest";
import {app} from "../../src/setting";

describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('should return 404 for not existing posts', async () => {
        await request(app)
            .get('/posts/' + -1)
            .expect(404)
    })

    it('should not create a post with an unauthorized user', async () => {
        await request(app)
            .post('/posts')
            .set('Authorization', '12345')
            .send({
                title: "",
                shortDescription: "",
                content: "",
                blogId: ""
            })
            .expect(401)

        await request(app)
            .get('/posts')
            .expect(200, [])

    })
    it('do not create a post with incorrect data', async () => {
        await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: "bad title",
                shortDescription: "bad shortDescription",
                content: "bad content",
                blogId: ""
            })
            .expect(400)

        await request(app)
            .get('/posts')
            .expect(200, [])

    })

    let createdBlog: any = null
    it('should create blog with correct input data', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'good name',
                description: 'good description',
                websiteUrl: 'https://learn.javascript.ru'
            })
            .expect(201)

        createdBlog = createResponse.body
    })

    let createdPost: any = null
    it('should create post with correct input data', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: "new Post",
                shortDescription: "new shortDescription",
                content: "new content",
                blogId: createdBlog.id
            })
            .expect(201)

        createdPost = createResponse.body

        expect(createdPost).toEqual({
            id: expect.any(String),
            title: expect.any(String),
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: expect.any(String),
        })
        await request(app)
            .get('/posts')
            .expect(200, [createdPost])
    })

    it('should`nt update post with incorrect authorization data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .set('Authorization', '12345')
            .send({
                title: 'good name',
                shortDescription: 'good description',
                content: 'https://learn.javascript.ru',
                blogId: ''
            })
            .expect(401)
    })
    it('should`nt update post with incorrect input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'good name',
                shortDescription: 'good description',
                content: 'https://learn.javascript.ru',
                blogId: ''
            })
            .expect(400)
    })

    it('should`nt update post that not exist', async () => {
        await request(app)
            .put('/posts/' + -1)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'good name',
                shortDescription: 'good description',
                content: 'https://learn.javascript.ru',
                blogId: ''
            })
            .expect(404)
    })

    it('should update post with correct input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                title: 'good new name',
                shortDescription: 'good new description',
                content: 'https://learn.javascript.ru',
                blogId: createdBlog.id
            })
            .expect(204)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect(200, {
                ...createdPost,
                title: 'good new name',
                shortDescription: 'good new description',
                content: 'https://learn.javascript.ru',
                blogId: createdBlog.id,
                blogName: createdBlog.name
            })
    })

    it('should not delete the post of an unauthorized user ', async () => {
        await request(app)
            .delete('/posts/' + createdPost.id)
            .set('Authorization', '12345')
            .expect(401)
    })

    it('should not delete post with not found id', async () => {
        await request(app)
            .delete('/posts/' + -1)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
    })

    it('should delete post with id', async () => {
        await request(app)
            .delete('/posts/' + createdPost.id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        await request(app)
            .get('/posts')
            .expect(200, [])

    })
})