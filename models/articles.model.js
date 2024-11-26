const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

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
        return rows;
     });
};

exports.checkArticleExists = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
  .then(({rows}) => {
    if(!rows.length) {
      return Promise.reject({ status: 404, msg: 'not found'})
    }
  })
}

exports.checkCommentExists = (comment_id) => {
  return db.query(`SELECT * 
    FROM comments 
    WHERE comment_id = $1`, 
    [comment_id])
  .then(({rows}) => {
    if(!rows.length) {
      return Promise.reject({ status: 404, msg: 'not found'})
    }
  })
}

exports.postCommentsMod = (comment, endpoint) => {

    const {author, body} = comment
    const id = Number(endpoint)

    return db.query(`INSERT INTO comments
      (article_id, author, body) 
      VALUES ($1, $2, $3) 
      RETURNING *`, 
      [id, author, body])
    .then(({rows}) => {
      // console.log(rows[0])
            return rows[0]
    })
}

exports.updateVotesMod = (votes, endpoint) => {
    const id = Number(endpoint)
    const voteCount = Number(votes.inc_votes)

    // console.log(voteCount)
    // console.log(id)

    return db.query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING*`,
      [voteCount, id]
    )
    .then(({rows}) => {
            return rows[0]
  })
}

exports.deleteCommentMod = (endpoint) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`,
    [endpoint]
  ).then(({rows}) => {
    if (rows.length === 0){
      return Promise.reject({status: 404, msg: 'not found'})
    }
  })
}