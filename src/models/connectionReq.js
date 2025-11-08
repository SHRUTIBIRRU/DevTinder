const mongoose = require("mongoose");

const connectReqSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{value} Incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectReqSchema.index({ fromUserId: 1, toUserId: 1 });

connectReqSchema.pre("save", async function (next) {
  const connectReq = this;
  if (connectReq.fromUserId.equals(connectReq.toUserId)) {
    throw new Error("Cannot send request to yourself!");
  }
  next();
});

const connectionReq = new mongoose.model(
  "ConnectionRequests",
  connectReqSchema
);

module.exports = connectionReq;
