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
