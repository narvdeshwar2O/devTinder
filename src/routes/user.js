const express = require("express");
const { userAuth } = require("../auth/auth");
const ConnectionRequest = require("../models/requestconnection.model");

const userRouter = express.Router();

const USER_FILDS_TO_BE_DISPLAY = "firstName skills profileUrl";

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_FILDS_TO_BE_DISPLAY);

    if (!pendingRequests.length) {
      return res.status(200).json({
        message: `Hi, ${loggedInUser.firstName}! There are no pending requests.`,
        data: [],
      });
    }

    return res.status(200).json({
      message: `You have ${pendingRequests.length} pending request(s).`,
      data: pendingRequests,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

userRouter.get("/user/request/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_FILDS_TO_BE_DISPLAY)
      .populate("toUserId", USER_FILDS_TO_BE_DISPLAY);
    res.json({ data: connectionRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { userRouter };
