const express = require('express');
const requestRouter = express.Router();
const userAuth = require("../middleware/auth"); // ✅ Correct import
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user"); // also fix this if you're using `User.findById()`

requestRouter.post("/send/:toUserId/:status", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    // const status = req.params.status;

    
    // console.log("Received status:", `"${status}"`); // 👈 Add quotes to catch spaces or %0A
    const status = req.params.status.trim(); // 👈 Fix applied here
    console.log("Received status:", `"${status}"`);
    
    const allowedStatuses = ["ignored", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send("Invalid status type");
    }
    
    

    // Check for duplicate request
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      return res.status(400).send("Connection request already exists");
    }

    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    await newRequest.save();
    res.send("Connection request sent successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const status = req.params.status.trim();
    const requestId = req.params.requestId.trim();
    const loggedInUser = req.user;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested" // make sure your DB has the right spelling
    });

    if (!connectionRequest) {
      return res.status(400).json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: `Connection request ${status}`,
      data
    });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = requestRouter;
