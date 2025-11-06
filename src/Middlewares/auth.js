const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  console.log("User auth is called");
  try {
    const { token } = req.cookies;
    //validate the token
    if (!token) {
      throw new Error("Invalid token!");
    }

    const decodedObj = await jwt.verify(token, "Dev@Tinder!99");
    const userId = decodedObj._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("No User found!");
    }
    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
