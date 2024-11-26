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
  test('404: returns a 404 error if making a request for a non-exisent resource', () => {
    return request(app)
    .get("/api/articles/99999")
    .expect(404)
    .then(({body}) => {
      const {msg} = body;
      expect(msg).toBe('Article not found')
    })
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
  test('200: returns an array of all articles sorted by date', () => {
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

describe("GET /api/articles/:article_id/comments", () => {
  test('200: returns an array of all comments related to a particular article, sorted by date', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body}) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy('created_at')
        comments.forEach((obj) => {
            expect(obj).toMatchObject({
                author: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_id: expect.any(Number)
        })
      })
    })
  })
  test('200: returns 200 if making request for article that exists but has no comments', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then(({body}) => {
      const {comments} = body
      expect(comments).toEqual([])
    })
  })
  test('404: returns a 404 error if making a request for a non-exisent resource', () => {
    return request(app)
    .get("/api/articles/5000/comments")
    .expect(404)
    .then(({body}) => {
      const {msg} = body;
      expect(msg).toBe('not found')
    })
  })
})

describe('POST /api/articles/:article_id/comments', () => {
  test('201: Allows a user to add a comment about an article ', () => {
      const newComment = {
          author: "rogersop",
          body: "comment comment comment comment comment",
      };
      return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then(({body}) => {
        expect(body.comment).toEqual(
          expect.objectContaining(
            {
              comment_id: 19,
              body: 'comment comment comment comment comment',
              article_id: 3,
              author: 'rogersop',
              votes: 0,
              created_at: expect.any(String)
            }
          )
        )
      })
   })
   test('404: throws an error when posting to an article that doesnt exist', () => {
    const newComment = {
        author: "rogersop",
        body: "comment comment comment comment comment",
    };
    return request(app)
    .post('/api/articles/5000/comments')
    .send(newComment)
    .expect(400)
    .then(({body}) => {
      const {msg} = body;
      expect(msg).toBe('bad request')
    })
 })
})
