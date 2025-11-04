
const jwt= require("jsonwebtoken");
const User=require("../models/user")


const userAuth=async(req,res,next)=>{//starting from admin all api will be handled by this middleware
    
    try{
    const {token}=req.cookies;

    if(!token){
        throw new Error("Token is not valid");
    }

    const decodedObj= jwt.verify(token,"DevVt@85699");

    const {_id}=decodedObj;

    const user=await User.findById(_id);
    if(!user){
        throw new Error("user not found");
    }
    req.user=user;//getting a user from req
    next();
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }

};

module.exports={
    userAuth,
}