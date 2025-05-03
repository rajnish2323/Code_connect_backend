const express = require('express');
const connectdb = require('./config');
const User = require('./models/user.js');
const usersignupdata = require('./utils/validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
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

// Connect to DB and start server
connectdb()
  .then(() => {
    console.log("✅ Connection established");
    app.listen(8000, () => {
      console.log("🚀 Server is listening on port 8000");
    });
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
  });
