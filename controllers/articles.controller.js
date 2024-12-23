const { getArticlesByIDMod, 
        getArticlesMod, 
        getCommentsMod, 
        postCommentsMod, 
        checkArticleExists,
        checkCommentExists,
        updateVotesMod,
        deleteCommentMod, 
        updateCommentsMod,
        deleteArticleMod,
        postArticlesMod} = require("../models/articles.model.js");

exports.getArticlesByIDCon = (req, res, next) => {
    const {article_id} = req.params
    getArticlesByIDMod(article_id).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((next))
}

exports.getArticlesCon = (req, res, next) => {
    const {sort_by, order, topic, limit, p} = req.query
    getArticlesMod(sort_by, order, topic, limit, p).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((next))
}

exports.getCommentsCon = (req, res, next) => {
    const {article_id} = req.params
    const {limit, p} = req.query
    const promises = [getCommentsMod(article_id, limit, p)]
    
    if (article_id){
        promises.push(checkArticleExists(article_id))
    }
    
    Promise.all(promises)
    .then(([comments]) => {
        res.status(200).send({comments})
    })
    .catch((next))
}

exports.postCommentsCon = (req, res, next) => {
    const comment = req.body
    const endpoint = req.params
    const article_id = endpoint.article_id
    const promises = [postCommentsMod(comment, article_id)]
    if (endpoint){
        promises.push(checkArticleExists(article_id))
    }


    Promise.all(promises)
    .then(([comment]) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        // console.log('inside Promise all')
        // console.log(err)
        next(err)
    })
}

exports.updateVotesCon = (req, res, next) => {
    const votes = req.body
    const endpoint = req.params.article_id
    const promises = [updateVotesMod(votes, endpoint)]

    if (endpoint){
        promises.push(checkArticleExists(endpoint))
    }


    Promise.all(promises)
    .then(([votes]) => {
        res.status(200).send({votes})
    })
    .catch((next))

}

exports.deleteCommentCon = (req, res, next) => {
    const endpoint = req.params.comment_id
    deleteCommentMod(endpoint)
    .then(() => {
        res.status(204).send()
    })
    .catch((next))
}

exports.updateCommentsCon = (req, res, next) => {
    const votes = req.body
    const endpoint = req.params.comment_id
    const promises = [updateCommentsMod(votes, endpoint)]

    if (endpoint){
        promises.push(checkCommentExists(endpoint))
    }

    Promise.all(promises)
    .then(([votes]) => {
        res.status(200).send({votes})
    })
    .catch((next))
}

exports.deleteArticleCon = (req, res, next) => {
    const endpoint = req.params.article_id
    deleteArticleMod(endpoint)
    .then(() => {
        res.status(204).send()
    })
    .catch((next))
}

exports.postArticlesCon = (req, res, next) => {
    const article = req.body
    postArticlesMod(article).then((article) => {
        res.status(201).send({article})
    })
    .catch((next))
}