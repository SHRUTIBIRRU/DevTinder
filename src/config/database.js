const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ShrutiDev:NbxUL3BGBoUmp720@namastenode.r23tdlw.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
