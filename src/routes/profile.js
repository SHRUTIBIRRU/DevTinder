const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const { validateEditFields } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  //validate the token
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //get the updated data
    const userInputData = req.body;

    const isValidUpdate = validateEditFields(userInputData);
    if (isValidUpdate) {
      const loggedInData = req.user;
      if (userInputData.skills?.length > 10) {
        throw new Error("Skills should be less than 10");
      }
      Object.keys(userInputData).forEach(
        (key) => (loggedInData[key] = userInputData[key])
      );
      //save the data in DB
      await loggedInData.save();
      res.json({
        message: `${loggedInData.firstName}, you're profile updated successfully!!`,
        data: loggedInData,
      });
    } else {
      throw new Error("Invalid Update");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  //get the new password
  try {
    const { password } = req.body;
    const { user } = req;

    if (!validator.isStrongPassword(password)) {
      throw new Error("Enter strong password");
    }
    //check if the password is same as the previous password
    const passwordHash = await bcrypt.hash(password, 10);
    user[password] = passwordHash;
    await user.save();
    res.send("Password changes successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
