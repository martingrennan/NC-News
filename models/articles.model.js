const db = require("../db/connection");

exports.getArticlesByIDMod = (article_id) => {
  let sqlQuery = `SELECT articles.*, 
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id `;
  const queryValues = [];

  if (article_id) {
    sqlQuery += ` WHERE articles.article_id = $1`;
    queryValues.push(article_id);
  }

  sqlQuery += ` GROUP BY articles.article_id;`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      throw { status: 404, msg: "Article not found" };
    }
    return rows;
  });
};

exports.getArticlesMod = (sort_by = "created_at", order, topic, limit = 10, p = 0) => {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "article_img_url",
    "votes",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC"];
  const queryValues = [];

  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request in sort by query" });
  }

  if (order && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request in order query" });
  }

  if (!order) {
    order = "ASC";
  }

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.votes,
    COUNT(comments.comment_id) AS comment_count
    FROM articles LEFT JOIN comments 
    ON articles.article_id = comments.article_id`;

  if (topic) {
    sqlQuery += ` WHERE topic = $1 `;
    queryValues.push(topic);
  }

  sqlQuery += ` GROUP BY articles.article_id`;

  if (sort_by) {
    sqlQuery += ` ORDER BY ${sort_by} ${order}`;
  }

  sqlQuery += ` LIMIT ${limit} OFFSET ${p} `

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      throw { status: 404, msg: "Article not found" };
    }
    return rows;
  });
};

exports.getCommentsMod = (article_id, limit = 10, p = 0) => {
  let sqlQuery = `SELECT *
    FROM comments `;
  const queryValues = [];

  if (article_id) {
    sqlQuery += `WHERE article_id = $1`;
    queryValues.push(article_id);
  }

  sqlQuery += ` ORDER BY created_at ASC
                LIMIT ${limit} OFFSET ${p}`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.postCommentsMod = (comment, endpoint) => {
  const { author, body } = comment;

  return db
    .query(
      `INSERT INTO comments
      (article_id, author, body) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [endpoint, author, body]
    )
    .then(({ rows }) => {
      console.log(rows[0])
      return rows[0];
    });
};

exports.updateVotesMod = (votes, endpoint) => {
  const id = endpoint;
  const voteCount = votes.inc_votes;

  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING*`,
      [voteCount, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteCommentMod = (endpoint) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`,
      [endpoint]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(
      `SELECT * 
    FROM comments 
    WHERE comment_id = $1`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.updateCommentsMod = (votes, endpoint) => {
  const id = endpoint;
  const voteCount = votes.inc_votes;

  return db
    .query(
      `UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING*`,
      [voteCount, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteArticleMod = (endpoint) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE article_id = $1
    RETURNING *`,
      [endpoint]
    )
    .then(() => {
      return db.query(
        `DELETE FROM articles
    WHERE article_id = $1
    RETURNING *`,
        [endpoint]
      );
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.postArticlesMod = (articles) => {
  const { author, title, body, topic, article_img_url } = articles;

  return db
  .query(
    `INSERT INTO articles
    (author, title, body, topic, article_img_url) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`,
    [author, title, body, topic, article_img_url]
  )
  .then(({ rows }) => {
    return rows[0];
  });
}