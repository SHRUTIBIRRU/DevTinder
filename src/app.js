const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello");
});

app.listen(9999, () => {
  console.log("Server Listening on Port 9999"); //callback called once server is created
});
