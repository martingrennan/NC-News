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