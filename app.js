const express = require("express")
const { getApi } = require("./controllers/api.controller")
const { getTopicsCon } = require("./controllers/topics.controller")
const app = express()
app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopicsCon)





module.exports = app