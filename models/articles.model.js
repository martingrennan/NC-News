const db = require('../db/connection')

exports.getArticlesByIDMod = (article_id, sort_by) => {
    const validSortBy = ['author']
    if (sort_by && !validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'bad request'})
    }

    let sqlQuery = `SELECT *
    FROM articles `
    const queryValues = []

    if (article_id) {
        sqlQuery += `WHERE article_id = $1`;
        queryValues.push(article_id)
    }

    return db.query(sqlQuery, queryValues)
    .then(({rows}) => {
        return rows
    })
}