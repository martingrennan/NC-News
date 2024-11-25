const express = require("express")
const { getApi } = require("./controllers/controller")
const app = express()
app.use(express.json())

app.get('/api', getApi)





module.exports = app