const endpointsJson = require("../endpoints.json");
const request = require('supertest');
const db = require('../db/connection')
const data = require('../db/data/test-data')
const app = require('../app')
const seed = require('../db/seeds/seed')

afterAll(() => db.end())

beforeEach(() => seed(data));

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test('200: returns an array of all topics', () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((obj) => {
            expect(obj).toMatchObject({
                description: expect.any(String),
                slug: expect.any(String),
        })
      })
    })
  })
  test('404: returns a 404 error if path is incorrect', () => {
    return request(app)
    .get("/api/topis")
    .expect(404)
  })
})

describe("GET /api/articles/article_id", () => {
  test('200: returns an array of first article', () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((obj) => {
            expect(obj).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
        })
      })
    })
  })
  test('200: returns an array of other viable articles', () => {
    return request(app)
    .get("/api/articles/12")
    .expect(200)
    .then(({body}) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((obj) => {
            expect(obj).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
        })
      })
    })
  })
  test('404: returns a 404 error if path is incorrect', () => {
    return request(app)
    .get("/api/articl")
    .expect(404)
  })
  test('400: returns a 400 error if there is a bad request in path', () => {
    return request(app)
    .get("/api/articles/hello")
    .expect(400)
    .then(({body}) => {
      const {msg} = body;
      expect(msg).toBe('bad request')
    })
  })
})

describe("GET /api/articles", () => {
  test.only('200: returns an array of all articles sorted by date', () => {
    return request(app)
    .get("/api/articles?sort_by=created_at")
    .expect(200)
    .then(({body}) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy('created_at')
        articles.forEach((obj) => {
            expect(obj).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String)
        })
      })
    })
  })
  test('400: returns a 400 error if there is a bad request in path', () => {
    return request(app)
    .get("/api/articles?sort_by=hello")
    .expect(400)
    .then(({body}) => {
      const {msg} = body;
      expect(msg).toBe('bad request')
    })
  })
})