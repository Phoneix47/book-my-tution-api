const jwt = require("jsonwebtoken");

function auth_student(req, res, next) {
  let access_token = req.header("authorization").split(" ")[1];

  jwt.verify(access_token, "secret", async (error, user) => {
    user.data.user_type === "student";
    next();
  });
  
}

module.exports = auth_student;
