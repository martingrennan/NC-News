const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopicsCon, postTopicsCon } = require("./controllers/topics.controller");
const {
  getArticlesByIDCon,
  getArticlesCon,
  getCommentsCon,
  postCommentsCon,
  updateVotesCon,
  deleteCommentCon,
  updateCommentsCon,
  deleteArticleCon,
  postArticlesCon,
} = require("./controllers/articles.controller");
const {
  getUsersCon,
  getUserByUsernameCon,
} = require("./controllers/users.controller");
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopicsCon);

app.get("/api/articles/:article_id", getArticlesByIDCon);

app.get("/api/articles", getArticlesCon);

app.get("/api/articles/:article_id/comments", getCommentsCon);

app.post("/api/articles/:article_id/comments", postCommentsCon);

app.patch("/api/articles/:article_id", updateVotesCon);

app.delete("/api/comments/:comment_id", deleteCommentCon);

app.get("/api/users", getUsersCon);

app.get("/api/users/:username", getUserByUsernameCon);

app.patch("/api/comments/:comment_id", updateCommentsCon);

app.delete("/api/articles/:article_id", deleteArticleCon);

app.post("/api/topics", postTopicsCon);

app.post("/api/articles", postArticlesCon);

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "incomplete entry" });
  }
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "bad request" });
  }
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
