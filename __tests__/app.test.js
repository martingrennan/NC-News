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
   test('400: throws an error when posting to an article that doesnt exist', () => {
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

describe('PATCH /api/articles/:article_id', () => {
  test('200: Allows a user to update votes on an article POSITIVE NUMBER', () => {
      const newVote = {inc_votes: 100};
      return request(app)
      .patch('/api/articles/1')
      .send(newVote)
      .expect(200)
      .then(({body}) => {
        expect(body.votes).toEqual(
          expect.objectContaining(
            {
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 200,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          )
        )
      })
   })
   test('200: Allows a user to update votes on an article NEGATIVE NUMBER', () => {
    const newVote = {inc_votes: -100};
    return request(app)
    .patch('/api/articles/1')
    .send(newVote)
    .expect(200)
    .then(({body}) => {
      expect(body.votes).toEqual(
        expect.objectContaining(
          {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        )
      )
    })
 })
   test('404: throws an error when posting to an article that doesnt exist', () => {
    const newVote = {inc_votes: 100};
    return request(app)
    .patch('/api/articles/5000')
    .send(newVote)
    .expect(404)
    .then(({body}) => {
      const {msg} = body;
      expect(msg).toBe('not found')
    })
 })
 test('400: throws an error when passing in an invalid vote count', () => {
  const newVote = {inc_votes: 'HELLO'};
  return request(app)
  .patch('/api/articles/5000')
  .send(newVote)
  .expect(400)
  .then(({body}) => {
    const {msg} = body;
    expect(msg).toBe('bad request')
  })
})
})

describe('DELETE /api/comments/:comment_id', () => {
  test('204: Allows a user to delete a comment', () => {
      return request(app)
      .delete('/api/comments/5')
      .expect(204)
   })
   test('404: throws an error when trying to delete to an article that doesnt exist', () => {
    return request(app)
    .delete('/api/comments/5000')
    .expect(404)
    .then(({body}) => {
      const {msg} = body;
      expect(msg).toBe('not found')
    }) 
 })
 test('400: throws an error when trying to input bad request', () => {
  return request(app)
  .delete('/api/comments/hello')
  .expect(400)
  .then(({body}) => {
    const {msg} = body;
    expect(msg).toBe('bad request')
  })
})
})

describe("GET /api/users", () => {
  test('200: returns an array of all users', () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((obj) => {
            expect(obj).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
        })
      })
    })
  })
})