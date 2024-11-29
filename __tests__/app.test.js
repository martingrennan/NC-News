const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const app = require("../app");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());

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
  test("200: returns an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((obj) => {
          expect(obj).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/article_id", () => {
  test("200: returns an array of first article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((obj) => {
          expect(obj).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "11",
          });
        });
      });
  });
  test("200: returns an array of other viable articles", () => {
    return request(app)
      .get("/api/articles/12")
      .expect(200)
      .then(({ body }) => {
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
            comment_count: "0",
          });
        });
      });
  });
  test("404: returns a 404 error if making a request for a non-exisent resource", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article not found");
      });
  });
  test("400: returns a 400 error if there is a bad request in path", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: returns an array of all articles sorted by date and not to have body property, limited to 10 results by default", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        expect(articles).toBeSortedBy("created_at");
        articles.forEach((obj) => {
          expect(obj).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: returns an array of all articles sorted by votes DESCENDING", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=DESC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        expect(articles).toBeSortedBy("votes", { descending: true });
        articles.forEach((obj) => {
          expect(obj).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: returns an array of all articles sorted by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        expect(articles).toBeSortedBy("author");
        articles.forEach((obj) => {
          expect(obj).not.toHaveProperty("body");
          expect(obj).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: returns an array of all articles filtered by topic MITCH", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        articles.forEach((obj) => {
          expect(obj).not.toHaveProperty("body");
          expect(obj).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: returns an array of all articles filtered by topic CATS", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        articles.forEach((obj) => {
          expect(obj).not.toHaveProperty("body");
          expect(obj).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "cats",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: returns an array of all articles sorted by date, limited to 3 results", () => {
    return request(app)
      .get("/api/articles?limit=3")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(3);
        expect(articles).toBeSortedBy("created_at");
        articles.forEach((obj) => {
          expect(obj).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: returns an array of all articles sorted by date, limited to 2 results, offset by 5 ", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&limit=2&p=3")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(2);
        expect(articles).toBeSortedBy("created_at");
        expect(articles).toEqual([
          {
            author: 'rogersop',
            title: 'Student SUES Mitch!',
            article_id: 4,
            topic: 'mitch',
            created_at: "2020-05-06T01:14:00.000Z",
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            votes: 0,
            comment_count: '0'
          },
          {
            author: 'rogersop',
            title: 'UNCOVERED: catspiracy to bring down democracy',
            article_id: 5,
            topic: 'cats',
            created_at: "2020-08-03T13:14:00.000Z",
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            votes: 0,
            comment_count: '2'
          }
        ])
      });
  });
  test("404: returns an error when searching for an invalid endpoint", () => {
    return request(app)
      .get("/api/articles?topic=cat")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article not found");
      });
  });
  test("400: returns a 400 error if there is a bad sort_by request in path", () => {
    return request(app)
      .get("/api/articles?sort_by=hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request in sort by query");
      });
  });
  test("400: returns a 400 error if there is a bad sort_by request in path", () => {
    return request(app)
      .get("/api/articles?order=hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request in order query");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array of all comments related to a particular article, sorted by date, limited to 10 by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(10);
        expect(comments).toBeSortedBy("created_at");
        comments.forEach((obj) => {
          expect(obj).toMatchObject({
            author: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_id: expect.any(Number),
          });
        });
      });
  });
  test("200: returns an array of all comments related to a particular article, sorted by date, limited to 5", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(5);
        expect(comments).toBeSortedBy("created_at");
        comments.forEach((obj) => {
          expect(obj).toMatchObject({
            author: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_id: expect.any(Number),
          });
        });
      });
  });
  test("200: returns an array of all comments related to a particular article, sorted by date, limited to 2, starting at comment 5", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2&p=5")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2);
        expect(comments).toBeSortedBy("created_at");
        expect(comments).toEqual([
          {
            comment_id: 8,
            body: 'Delicious crackerbreads',
            article_id: 1,
            author: 'icellusedkars',
            votes: 0,
            created_at: "2020-04-14T20:19:00.000Z"
          },
          {
            comment_id: 7,
            body: 'Lobster pot',
            article_id: 1,
            author: 'icellusedkars',
            votes: 0,
            created_at: "2020-05-15T20:19:00.000Z"
          }
        ])
      });
  });
  test("200: returns 200 if making request for article that exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("404: returns a 404 error if making a request for a non-exisent resource", () => {
    return request(app)
      .get("/api/articles/5000/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Allows a user to add a comment about an article ", () => {
    const newComment = {
      author: "rogersop",
      body: "comment comment comment comment comment",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            body: "comment comment comment comment comment",
            article_id: 3,
            author: "rogersop",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  // THIS SHOULD BE 404 ERROR - problem with async operations/ Promise all?
  test("404: throws an error when posting to an article that doesnt exist", () => {
    const newComment = {
      author: "rogersop",
      body: "comment comment comment comment comment",
    };
    return request(app)
      .post("/api/articles/5000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("400: throws an error when there is a bad request in path", () => {
    const newComment = {
      author: "rogersop",
      body: "comment comment comment comment comment",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
  test("400: throws an error when trying to post incomplete new comment", () => {
    const newComment = {
      author: "rogersop",
      body: null,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("incomplete entry");
      });
  });
  test("404: throws an error when the author is invalid and not in database", () => {
    const newComment = {
      author: "roger",
      body: "comment comment comment comment comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Allows a user to update votes on an article POSITIVE NUMBER", () => {
    const newVote = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toEqual(
          expect.objectContaining({
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 200,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
  test("200: Allows a user to update votes on an article NEGATIVE NUMBER", () => {
    const newVote = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toEqual(
          expect.objectContaining({
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
  test("404: throws an error when posting to an article that doesnt exist", () => {
    const newVote = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/5000")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("400: throws an error when passing in an invalid vote count", () => {
    const newVote = { inc_votes: "HELLO" };
    return request(app)
      .patch("/api/articles/5000")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Allows a user to delete a comment", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("404: throws an error when trying to delete to a comment that doesnt exist", () => {
    return request(app)
      .delete("/api/comments/5000")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("comment not found");
      });
  });
  test("400: throws an error when there is a bad request in path", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((obj) => {
          expect(obj).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/username", () => {
  test("200: returns an array of first user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveLength(1);
        user.forEach((obj) => {
          expect(obj).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
      });
  });
  test("200: returns an array of other user", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toHaveLength(1);
        user.forEach((obj) => {
          expect(obj).toMatchObject({
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          });
        });
      });
  });
  test("404: returns a 404 error if making a request for a non-exisent user", () => {
    return request(app)
      .get("/api/users/hello")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Allows a user to update votes on a comment POSITIVE NUMBER", () => {
    const newVote = { inc_votes: 100 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toEqual(
          expect.objectContaining({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 116,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
            comment_id: 1,
          })
        );
      });
  });
  test("200: Allows a user to update votes on an article NEGATIVE NUMBER", () => {
    const newVote = { inc_votes: -5 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toEqual(
          expect.objectContaining({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 11,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
            comment_id: 1,
          })
        );
      });
  });
  test("404: throws an error when posting to an article that doesnt exist", () => {
    const newVote = { inc_votes: 100 };
    return request(app)
      .patch("/api/comments/5000")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
  test("400: throws an error when passing in an invalid vote count", () => {
    const newVote = { inc_votes: "HELLO" };
    return request(app)
      .patch("/api/comments/5000")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: Allows a user to delete an article which has no comments on it", () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  test("204: Allows a user to delete an article which has comments related to it as a foreign key", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("404: throws an error when trying to delete to an article that doesnt exist", () => {
    return request(app)
      .delete("/api/articles/5000")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("article not found");
      });
  });
  test("400: throws an error when there is a bad request in path", () => {
    return request(app)
      .delete("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("POST /api/topics", () => {
  test("201: Allows a user to add a topic ", () => {
    const newTopic = {
      slug: "topic name here",
      description: "description here"
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toEqual(
          expect.objectContaining({
              slug: "topic name here",
              description: "description here"
          })
        );
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Allows a user to add a new article with article_img_url included already", () => {
    const newArticle = {
      author: "rogersop",
      title: "example title",
      body: "example body",
      topic: "mitch",
      article_img_url: "http/example/article/img/url/22621565"
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "rogersop",
            title: "example title",
            body: "example body",
            topic: "mitch",
            article_img_url: "http/example/article/img/url/22621565",
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("201: Allows a user to add a new article with article_img_url not included", () => {
    const newArticle = {
      author: "rogersop",
      title: "example title",
      body: "example body",
      topic: "mitch",
      article_img_url: null
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "rogersop",
            title: "example title",
            body: "example body",
            topic: "mitch",
            article_img_url: null,
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400 throws an error when trying to post incomplete new article", () => {
    const newArticle = {
      author: "rogersop",
      title: null,
      body: "example body",
      topic: "mitch",
      article_img_url: "http/example/article/img/url/22621565"
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("incomplete entry");
      });
  });
  test("404: throws an error when the author is invalid and not in database", () => {
    const newArticle = {
      author: "author not in database",
      title: "example title",
      body: "example body",
      topic: "mitch",
      article_img_url: "http/example/article/img/url/22621565"
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });
});