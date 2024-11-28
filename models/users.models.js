const db = require("../db/connection");

exports.getUsersMod = () => {
    let sqlQuery = `SELECT *
    FROM users `;
  const queryValues = [];

  return db.query(sqlQuery, queryValues)
  .then(({ rows }) => {
    if (rows.length === 0){
        throw { status: 404, msg: 'User not found' }  
    }
    return rows;
  });
}

exports.getUserByUsernameMod = (username) => {
  return db.query
      (`SELECT * 
       FROM users
       WHERE users.username = $1`,
      [username])
  .then(({ rows }) => {
       if (rows.length === 0){
          throw { status: 404, msg: 'User not found' }  
      }
      return rows;
  });
}