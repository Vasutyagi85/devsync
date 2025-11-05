const express=require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter=express.Router();
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested" 
        }).populate("fromUserId",USER_SAFE_DATA);
        res.json({message:"data fetched successfully",data:connectionRequest});
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequests=await ConnectionRequest.find({
            $or: [
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId: loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",USER_SAFE_DATA)

        const data=connectionRequests.map((row)=>{
            if(row.fromUserId.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });//because i dont want unnecessary data like connection details
        res.json({data});
    }catch(err){
        res.status(400).send({message:err.message});
    }
});

userRouter.get("/feed",userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;

        //all connection req sent or recieved
        const connectionRequest=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
        }).select("fromUserId toUserId")

        //adding those connection req only one time 
        const hideUsersFromFeed=new Set();
        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        
        const users=await User.find({
            $and:[
            {_id:{$nin:Array.from(hideUsersFromFeed) } },//user not sent the connection req to its connections
            {_id:{$ne: loggedInUser._id}},//the user which is logged in should not see its own card
            ]//converting set into array nin means not in
        })
        .select(USER_SAFE_DATA)
        .skip(skip)//if we not pass skip then it will take 0
        .limit(limit);//if we dont pass limit then it will pass

        res.send(users)
    }catch(err){
        res.status(400).json({message:err.message});
    }
})
module.exports=userRouter;