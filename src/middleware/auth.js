const jwt = require('jsonwebtoken');
// const user  = require('./user');
const User = require('../models/user');


const userAuth= async (req,res,next)=>{
try{
const{token}= req.cookies;
if(!token){
    throw new Error("invalid token !!!!");

}
const decodeobj = await jwt.verify(token,"DEVTINDER007" );
const _id = decodeobj;
const user = await User.findById(_id);

if(!user){
    throw new Error("user not found");
}
req.user = user;
next();
}catch(err){
    res.status(400).send("error"+err.message);
}
}
module.exports=userAuth;
