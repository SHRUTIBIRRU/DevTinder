const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateReq } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../Middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  //creating instance of new User model
  //means creating a new user with the user data

  try {
    //validate the password
    validateReq(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passWordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passWordHash,
    });

    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error occured while saving user :" + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid emailId");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid crendentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create token
      const token = await user.getJWT(); //using attached methods on userSchema

      //send token back to the client
      //for 7 days so 7 * 24 hr Took reference for Express documentation
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", userAuth, (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send(req.user.firstName + "  You're Logged out successfully!");
});

module.exports = authRouter;
