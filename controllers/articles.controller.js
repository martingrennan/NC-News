const { getArticlesByIDMod, getArticlesMod } = require("../models/articles.model.js");

exports.getArticlesByIDCon = (req, res, next) => {
    const {article_id} = req.params
    getArticlesByIDMod(article_id).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((next))
}

exports.getArticlesCon = (req, res, next) => {
    const {sort_by} = req.query

    getArticlesMod(sort_by).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err)=> {
        console.log(err, 'err')
        next(err)
    })
}