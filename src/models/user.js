const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: { type: String, required: true },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Valid Password:" + value);
        }
      },
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Id:" + value);
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "Developer are in serach for someone here.",
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1740779693~exp=1740783293~hmac=3ffc11733917c931bddeec957e8fa649e6a1590282b3210d816ccbf54dab2e94&w=900",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid PhotoURL" + value);
        }
      },
    },
    skills: [String],
  },
  { timestamps: true }
);

//Industry standard/ Best practice
//here we have attached user specific methods on user schema
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder!99", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  console.log('called')
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    user.password
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
