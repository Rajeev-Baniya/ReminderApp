const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("Authentication fail");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.json({
      status: "fail",
      message: "Not authenticated",
    });
  }
};

module.exports = auth;
