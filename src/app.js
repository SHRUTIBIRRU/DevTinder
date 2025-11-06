const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateReq } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./Middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    //create a jwt token

    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid emailId");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid crendentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create token
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder!99", {
        expiresIn: "7d",
      });
      //send token back to the client
      //for 7 days so 7 * 24 hr Took reference for Express documentation
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 3600000),
      });
      res.send("Successfully Login");
    } else {
      throw new Error("Invalid crendentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  //validate the token
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.id;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully !");
  } catch (err) {
    res.status(400).send("Error while deleting user", err);
  }
});

app.patch("/update/:id", async (req, res) => {
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
app.get("/user", async (req, res) => {
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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database is connected...");
    app.listen(9999, () => {
      console.log("Server Listening on Port 9999");
    });
  })
  .catch((err) => console.log("Error in DB connection:", err));
