const express = require("express")
const { getApi } = require("./controllers/api.controller")
const { getTopicsCon } = require("./controllers/topics.controller")
const { getArticlesByIDCon, getArticlesCon, getCommentsCon, postCommentsCon } = require("./controllers/articles.controller")
const { errorMonitor } = require("supertest/lib/test")
const app = express()

app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopicsCon)

app.get('/api/articles/:article_id', getArticlesByIDCon)

app.get('/api/articles', getArticlesCon)

app.get('/api/articles/:article_id/comments', getCommentsCon)

app.post('/api/articles/:article_id/comments', postCommentsCon)

app.use((err, req, res, next) => {
    // console.log(err)
    if (err.code === "22P02" || err.code === "23503"){
        res.status(400).send({msg: 'bad request'})
    }
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
})

module.exports = app