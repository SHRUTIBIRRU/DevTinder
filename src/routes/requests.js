const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");
const ConnectionReq = require("../models/connectionReq");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    //get fromUserId, toUserID and status
    //Validation to be added
    //  and save to DB

    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //check if same user is sending request to self
      //check if user exists
      const isValidToUser = await User.findById(toUserId);
      if (!isValidToUser) {
        throw new Error("User not found!");
      }

      //check req includes interested or ignored status

      const allowedStatus = ["interested", "ignored"];
      const isAllowedStatus = allowedStatus.includes(status);
      if (!isAllowedStatus) {
        throw new Error("Incorrect status type : " + status);
      }

      //check if request is already sent
      const ExistisngConnectReq = await ConnectionReq.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (ExistisngConnectReq) {
        throw new Error("Connection Request Already Exists!");
      }

      const connectReqData = new ConnectionReq({
        fromUserId,
        toUserId,
        status,
      });

      await connectReqData.save();

      res.json({ message: "Request sent successfully", data: connectReqData });
    } catch (err) {
      console.log("ERROR", err.message);
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //validate allowed status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Incorrect status type");
      }
      //validate the requestId
      const connectionRequest = await ConnectionReq.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(404).json({ message: "Connection Request Not Found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: `Request ${status}!`, data: data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
