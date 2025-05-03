const express= require('express');
const profileRouter = express.Router();
const User = require('../models/user.js');
const userAuth = require('../middleware/auth');
const validateEditProfileData= require('../utils/validator.js');


profileRouter.get('/profile/view',  userAuth , async (req,res)=>{
    const user = req.user;
     res.send(user);
 })
 profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        // You probably want to validate the body, not (req, res)
        if (!validateEditProfileData(req.body)) {
            throw new Error("Invalid request");
        }

        const loggedinUser = req.user;

        // Update the fields safely
        Object.keys(req.body).forEach((key) => {
            if (key in loggedinUser) {
                loggedinUser[key] = req.body[key];
            }
        });

        await loggedinUser.save();

        console.log(loggedinUser); // fixed typo from loggeginuser
        res.send("✅ Profile updated");

    } catch (err) {
        console.error("❌ Error updating profile:", err.message);
        res.status(400).send("❌ Error: " + err.message);
    }
});


module.exports= profileRouter;