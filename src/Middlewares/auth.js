const adminAuth = (req, res, next) => {
  console.log("Admin auth is called");
  const token = "abc";
  const isAuth = token === "abc";
  if (!isAuth) {
    res.status(401).send("UnAuthourized request");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("User auth is called");
  const token = "abc";
  const isAuth = token === "abc";
  if (!isAuth) {
    res.status(401).send("UnAuthourized request");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
