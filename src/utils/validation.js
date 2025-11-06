const validator = require("validator");
const validateReq = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password");
  }
};

const validateEditFields = (userInputData) => {
  const allowedFieldsUpdate = [
    "firstName",
    "lastName",
    "skills",
    "age",
    "gender",
    "emailId",
    "about",
    "photoUrl",
  ];

  const isValidUpdate = Object.keys(userInputData).every((k) =>
    allowedFieldsUpdate.includes(k)
  );
  return isValidUpdate;
};

module.exports = { validateReq, validateEditFields };
