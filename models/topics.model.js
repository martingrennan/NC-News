const db = require('../db/connection')

exports.getTopicsMod = () => {

    let sqlQuery = `SELECT *
    FROM topics`

    const queryValues = []

    return db.query(sqlQuery, queryValues)
    .then(({rows}) => {
        return rows
    })
}