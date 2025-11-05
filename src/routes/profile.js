const express=require("express");
const {userAuth}=require("../middlewares/auth");
const  profileRouter=express.Router();
const {validateEditProfileData}=require("../utils/validation")

profileRouter.get("/profile",userAuth,async(req,res)=>{//added middleware userAuth before handler function
    
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error: "+err.message)
    }
    
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("invalid edit request");
        }

        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))

        await loggedInUser.save();

        res.json({message: `${loggedInUser.firstName} successfully updated`,data:loggedInUser});
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});


module.exports=profileRouter;