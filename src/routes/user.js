const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../Middlewares/auth");

userRouter.delete("/delete", async (req, res) => {
  const userId = req.body.id;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully !");
  } catch (err) {
    res.status(400).send("Error while deleting user", err);
  }
});

userRouter.patch("/update/:id", async (req, res) => {
  const userId = req.params?.id;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "gender",
      "age",
      "firstname",
      "lastname",
      "photoUrl",
      "about",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills are not allowed more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong..," + err.message);
  }
});

//findUser by emailId
userRouter.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  // const userId = req.body.id;
  console.log("req.body", req.body.id);
  try {
    // const users = await User.findById(userId);
    const users = await User.find({ emailId });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong", err.mesaage);
  }
});

userRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = userRouter;
