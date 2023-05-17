import request from "supertest";
import {app} from "../../src/setting";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('should return 404 for not existing blogs', async () => {
        await request(app)
            .get('/blogs/' + -1)
            .expect(404)
    })

    it('should not create a blog with an unauthorized user', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', '12345')
            .send({
                _id: 'good id',
                name: 'good name',
                description: 'description valid',
                websiteUrl: 'https://learn.javascript.ru'
            })
            .expect(401)

        await request(app)
            .get('/blogs')
            .expect(200, [])

    })
    it('do not create a blog with incorrect data', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                _id: '',
                name: '',
                description: '',
                websiteUrl: ''
            })
            .expect(400)

        await request(app)
            .get('/blogs')
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

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            websiteUrl: expect.any(String),
            isMembership: false,
            createdAt: expect.any(String),
        })
        await request(app)
            .get('/blogs')
            .expect(200, [createdBlog])
    })

    it('should`nt update blog with incorrect authorization data', async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .set('Authorization', '12345')
            .send({
                name: 'good name',
                description: 'good description',
                websiteUrl: 'https://learn.javascript.ru'
            })
            .expect(401)
    })
    it('should`nt update blog with incorrect input data', async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: '',
                description: '',
                websiteUrl: ''
            })
            .expect(400)
    })

    it('should`nt update blog that not exist', async () => {
        await request(app)
            .put('/videos/' + -1)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'good name',
                description: 'good description',
                websiteUrl: 'https://learn.javascript.ru'
            })
            .expect(404)
    })

    it('should update blog with correct input data', async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                name: 'good new name',
                description: 'good new description',
                websiteUrl: 'https://youtube.com',
            })
            .expect(204)

        await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect(200, {
                ...createdBlog,
                name: 'good new name',
                description: 'good new description',
                websiteUrl: 'https://youtube.com',
            })
    })

    it('should not delete the blog of an unauthorized user ', async () => {
        await request(app)
            .delete('/blogs/' + createdBlog.id)
            .set('Authorization', '12345')
            .expect(401)
    })

    it('should not delete blog with not found id', async () => {
        await request(app)
            .delete('/blogs/' + -1)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
    })

    it('should delete blog with id', async () => {
        await request(app)
            .delete('/blogs/' + createdBlog.id)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        await request(app)
            .get('/blogs')
            .expect(200, [])

    })
})