const pool = require("../database/connection");

module.exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log(token);
    await pool.query(
      "SELECT * FROM session_table WHERE session_tokens = ?",
      [token],
      async (error, result) => {
        // console.log(result);
        if (!result[0]) {
          return res.status(401).json({ message: "Unauthorized User!!" });
        } else {
          req.userId = result[0].user_id;
          req.flag = result[0].flag[0];
          // console.log(typeof req.flag);
          return next();
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized User!!" });
  }
};

