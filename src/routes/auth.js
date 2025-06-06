const express = require("express");
const { validateSignup } = require("../utils/validate.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("current user", user);

    if (!user) {
      return res.status(401).json({
        message: "Email doesn't exist. Please create a new account.",
        status: false,
        data: null,
      });
    }

    const isValidPassword = await user.verifyPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "You have entered the wrong password",
        status: false,
        data: null,
      });
    }

    const token = await user.getJWT();
    res.cookie("token", token);

    const { password: _, ...currentUser } = user.toObject();
    return res.status(200).json({
      message: "User logged in successfully",
      status: true,
      data: currentUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      status: false,
      data: null,
    });
  }
});

// API for USER SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, email, password } = req.body;

    // checking whether email is already registered
    const isEmailAlreadyExits = await User.findOne({ email });
    if (isEmailAlreadyExits) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, email, password: hashedPassword });
    const data = await user.save();

    res
      .status(201)
      .json({ message: "You have successfully SignUp", data: data });
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successfully!!");
});

module.exports = authRouter;
