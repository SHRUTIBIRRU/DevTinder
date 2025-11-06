const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middlewares/auth");

requestRouter.post("/sendConnectionReq", userAuth, (req, res) => {
  res.send("Request send successfully");
});

module.exports = requestRouter;
