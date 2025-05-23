const validator = require("validator");
function validateSignup(req) {
  //   console.log("Validation the signup api", req.body);
  const { firstName, email, password } = req.body;
  if (!firstName || typeof firstName !== "string") {
    throw new Error("Name can't be null!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong!");
  }
}

function validateProfileUpdate(data) {
  const allowedFields = [
    "firstName",
    "lastName",
    "shortBio",
    "profileUrl",
    "skills",
    "age",
  ];
  return Object.keys(data).every((key) => allowedFields.includes(key));
}

function validateStrongPassword(newPassword) {
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Password is not strong");
  }
}

module.exports = {
  validateSignup,
  validateProfileUpdate,
  validateStrongPassword,
};
