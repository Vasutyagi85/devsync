const express=require('express');
const User=require("../models/user");
const{validateSignUpData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const authRouter=express.Router();

authRouter.post("/signUp",async(req,res)=>{

    // console.log(req.body);
    //creating a new instance of new user type of user schema defined in models
    // const newUser=new User(req.body);//data getting from api of user and create a user instance for that data
    //this is a bad way that everything whihc is coming from the user is saving to database

    try{
        //validation of data
        validateSignUpData(req);

        const {firstName,lastName,emailId,password}=req.body;


        //encryption of password
        const passwordHash=await bcrypt.hash(password,10);
        console.log(passwordHash);

        const newUser=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });


        await newUser.save();//saving the data into mongo db
        res.send("user added successfully");
    }catch (err){
        res.status(400).send("Error: "+err.message);
    }
});

authRouter.post("/login",async(req,res)=>{
    try{
        const{emailId,password}=req.body;

        const user=await User.findOne({emailId:emailId});

        if(!user){
            throw new Error("Invalid credential");
        }

        const isPasswordValid=await user.validatePassword(password);

        if(isPasswordValid){

            //generate a token
            const token=await user.getJWT();

            //send a cookie
            res.cookie("token",token,{
                expires:new Date(Date.now()+8*3600000)
            });
            res.send("Login Successfull!");
        }
        else{
            throw new Error("Invalid credential");
        }

    }catch(err){
        res.send("Error: "+err.message);
    }
});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("Logout successfully");
})
module.exports=authRouter;
