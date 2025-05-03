const express = require('express');
const connectdb = require('./config');
const User = require('./models/user.js');
const usersignupdata = require('./utils/validator');
const bcrypt = require('bcryptjs'); // safer for Vercel
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://code-connect-git-main-rajnish-kumar-sharmas-projects.vercel.app",
  credentials: true,
}));

// Routers
const AuthRouter = require('./router/auther');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/request'); 
const userRouter = require('./router/user');

app.use('/', AuthRouter);
app.use('/', profileRouter);
app.use('/request', requestRouter);
app.use('/', userRouter);

let isDbConnected = false;

connectdb()
  .then(() => {
    console.log("✅ Connection established");
    isDbConnected = true;
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
  });


module.exports = (req, res) => {
  if (!isDbConnected) {
    res.status(503).send('Database not connected');
    return;
  }
  return app(req, res);
};
