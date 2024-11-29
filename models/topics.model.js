const db = require('../db/connection')

exports.getTopicsMod = () => {

    let sqlQuery = `SELECT *
    FROM topics`

    return db.query(sqlQuery)
    .then(({rows}) => {
        return rows
    })
}

exports.postTopicsMod = (topic) => {
    const { slug, description } = topic;

    return db
    .query(
      `INSERT INTO topics
      (slug, description) 
      VALUES ($1, $2) 
      RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}