const db = require("../db/connection");

exports.getArticlesByIDMod = (article_id) => {
  let sqlQuery = `SELECT *
    FROM articles `;
  const queryValues = [];

  if (article_id) {
    sqlQuery += `WHERE article_id = $1`;
    queryValues.push(article_id);
  }

  return db.query(sqlQuery, queryValues)
  .then(({ rows }) => {
    if (rows.length === 0){
        throw { status: 404, msg: 'Article not found' }  
    }
    return rows;
  });
};

exports.getArticlesMod = (sort_by) => {
  const validSortBy = ["created_at"];
  const queryValues = [];

  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.votes,
    COUNT(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id`;

  //now get rid of body ^^^
  //get comment_count

  if (sort_by) {
    sqlQuery += ` ORDER BY ${sort_by} ASC`;
  }

  return db.query(sqlQuery, queryValues)
  .then(({ rows }) => {
    if (rows.length === 0){
        throw { status: 404, msg: 'Article not found' }  
    }
    return rows;
  });
};

exports.getCommentsMod = (article_id) => {
    let sqlQuery = 
    `SELECT *
    FROM comments `;
    const queryValues = [];

    if (article_id) {
        sqlQuery += `WHERE article_id = $1`;
        queryValues.push(article_id);
      }

    sqlQuery += ` ORDER BY created_at ASC`

    return db.query(sqlQuery, queryValues)
    .then(({ rows }) => {
        if (rows.length === 0){
            throw { status: 404, msg: 'Article not found' }  
        }
        return rows;
     });
};

exports.postCommentsMod = (comment, endpoint) => {

    const {username, body} = comment

    console.log(username)
    console.log(body)
    console.log(endpoint.article_id)



    return db.query(
        `INSERT INTO comments (article_id, username, body) 
        VALUES ($1, $2, $3) 
        RETURNING*`,
        [endpoint.article_id, username, body])
    .then(({rows}) => {
    console.log(rows[0])
    return rows[0]
    })
}