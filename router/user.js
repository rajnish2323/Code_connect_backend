const express = require('express');
const userRouter = express.Router();
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');




userRouter.get("/user/request", userAuth , async (req , res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        console.error(err);
        res.status(400).send("User request is invalid");
    }
});



userRouter.get("/user/connection", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const connections = await ConnectionRequest.find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" }
        ],
      }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "about"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl", "age", "about"]);
      
  
      res.json({
        message: "Total connections fetched successfully",
        data: connections
      });
    } catch (err) {
      console.error(err);
      res.status(400).send("Cannot get user connections");
    }
  });


  
  userRouter.get("/feed", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Get all connection requests involving the current user
      const connectionRequests = await ConnectionRequest.find({
        $or: [
          { fromUserId: loggedInUser._id },
          { toUserId: loggedInUser._id }
        ]
      }).select("fromUserId toUserId");
  
      // Track all connected users
      const hideUserFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUserFromFeed.add(req.fromUserId.toString());
        hideUserFromFeed.add(req.toUserId.toString());
      });
  
      // Add the current user to the exclusion list
      hideUserFromFeed.add(loggedInUser._id.toString());
  
      // Fetch users not in the connection list (i.e., potential connections)
      const users = await User.find({
        _id: { $nin: Array.from(hideUserFromFeed) }
      })
      .select("firstName lastName skill about photoUrl age")
        .skip(skip)
        .limit(limit);
  
      res.json({
        message: "Feed fetched successfully",
        data: users
      });
  
    } catch (err) {
      console.error("Feed error:", err);
      res.status(400).send("Feed unavailable");
    }
  });
  

module.exports = userRouter;