const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
// const asyncHandler = require('express-async-handler')

const authMiddleware = async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded:', decoded)
        const user = await userModel.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(500).send({
        message: "Not Authorized token,expired,please Login again",
        error: error.message,
      });
    }
  } else {
    res.status(500).send({
      message: "There is no token attached to header",
    });
  }
};

const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await userModel.findOne({ email: email });
  if (adminUser.role !== "admin") {
    res.status(500).send({
      message: "you are not a Admin",
    });
  } else {
    next();
  }
};
module.exports = { authMiddleware, isAdmin };
