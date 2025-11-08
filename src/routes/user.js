const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../Middlewares/auth");
const ConnectionReq = require("../models/connectionReq");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const connectionRequests = await ConnectionReq.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionReq.find({
      $or: [
        { status: "accepted", fromUserId: loggedInUser._id },
        { status: "accepted", toUserId: loggedInUser._id },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data: data });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    //to handle large data
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    //get the connection related to logged in user
    //exclude those ids from user collection

    const connectionRequest = await ConnectionReq.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((conReq) => {
      hideUsersFromFeed.add(conReq.fromUserId.toString());
      hideUsersFromFeed.add(conReq.toUserId.toString());
    });
    console.log("loggedInUser", hideUsersFromFeed, loggedInUser);
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, //not in
        { _id: { $ne: loggedInUser._id } }, //not equals
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: "Success", data: users });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
// userRouter.delete("/delete", async (req, res) => {
//   const userId = req.body.id;
//   try {
//     await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully !");
//   } catch (err) {
//     res.status(400).send("Error while deleting user", err);
//   }
// });

// userRouter.patch("/update/:id", async (req, res) => {
//   const userId = req.params?.id;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       "gender",
//       "age",
//       "firstname",
//       "lastname",
//       "photoUrl",
//       "about",
//       "skills",
//     ];

//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Skills are not allowed more than 10");
//     }
//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Something went wrong..," + err.message);
//   }
// });

// //findUser by emailId
// userRouter.get("/user", async (req, res) => {
//   const emailId = req.body.emailId;
//   // const userId = req.body.id;
//   console.log("req.body", req.body.id);
//   try {
//     // const users = await User.findById(userId);
//     const users = await User.find({ emailId });
//     if (users.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong", err.mesaage);
//   }
// });

// userRouter.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

module.exports = userRouter;
