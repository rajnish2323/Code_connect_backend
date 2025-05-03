const express = require('express');
const Authrouter = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersignupdata = require('../utils/validator.js');

// SIGNUP
Authrouter.post('/signup', async (req, res) => {
  try {
    usersignupdata(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const {
      firstName,
      lastName,
      emailId,
      password,
      photoUrl,
      skills,
      about,
      age
    } = req.body;
    
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      about,
      age,
      password: hashedPassword,
      photoUrl: photoUrl || "https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg",
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
          ? skills.split(',').map(skill => skill.trim())
          : [] // default to empty array
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ _id: savedUser._id }, "DEVTINDER007", { expiresIn: '1h' });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000
    });

    res.status(201).json({
      message: "✅ Signup successful and user saved!",
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        emailId: savedUser.emailId,
        photoUrl: savedUser.photoUrl,
        skills: savedUser.skills
      }
    });

  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(400).send(err.message || "Internal Server Error");
  }
});


// LOGIN
Authrouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ _id: user._id }, "DEVTINDER007", { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      photoUrl: user.photoUrl,
      skills: user.skills,
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(400).send(err.message || "Login failed");
  }
});


// LOGOUT
Authrouter.post('/logout', (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "strict"
  });
  res.status(200).send("👋 Logged out successfully!");
});


module.exports = Authrouter;
