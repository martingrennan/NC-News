const db = require('../db/connection')

exports.getTopicsMod = () => {

    let sqlQuery = `SELECT *
    FROM topics`

    return db.query(sqlQuery)
    .then(({rows}) => {
        return rows
    })
}