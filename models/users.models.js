const db = require("../db/connection");

exports.getUsersMod = () => {
    let sqlQuery = `SELECT *
    FROM users `;
  const queryValues = [];

  return db.query(sqlQuery, queryValues)
  .then(({ rows }) => {
    if (rows.length === 0){
        throw { status: 404, msg: 'Article not found' }  
    }
    console.log(rows)
    return rows;
  });
}