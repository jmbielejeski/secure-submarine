const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {rejectUnauthenticated} = require('../modules/authentication-middleware');


router.get('/', rejectUnauthenticated, (req, res) => {
  // what is the value of req.user????
  console.log('req.user:', req.user);

  let sqlText;

  if (req.user.clearance_level < 3) {
    sqlText = `
    SELECT * FROM "secret"
    WHERE secrecy_level < 3;
    `;
  } else if (req.user.clearance_level < 6) {
    sqlText = `
      SELECT * FROM "secret"
      WHERE secrecy_level < 6;
    `
  } else if (req.user.clearance_level < 13) {
    sqlText = `
      SELECT * FROM "secret"
      WHERE secrecy_level < 13;
  `;
  } else {
    sqlText =`SELECT * FROM "secret";`;
  }

  pool
    .query(sqlText)
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
