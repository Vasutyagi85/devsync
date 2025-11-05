const express=require("express")
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    
    try{
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;

    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)){
        res.status(404).json({message:"invalid status type"+status});
    }

    //the req must not be sent if there is not that user present
    const toUser=await User.findById(toUserId);
    if(!toUser){
        return res.status(404).json({message:"User not found"});
    }

    

    //if user a sent an connection req to user b then user should not send a connection req to user a 
    //user a should not send the req again 
    const existingConnectionRequest=await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},//if user a user b present
            {fromUserId:toUserId, toUserId:fromUserId},//user b user a present
        ],
    });
    if(existingConnectionRequest){
        return res.status(400).send({message: "Connection Request Already Exists!"});
    }

    const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    });

    const data=await connectionRequest.save();

    res.json({
        message:req.user.firstName+"connection request sent successfully"+toUser.firstName,
        data
    })
    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
    console.log(req.user)
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{//reqid is obj id in conn req
    try{
        const loggedInUser=req.user;
        const {status,requestId}=req.params
        //user must be loggedin
        //connection req status must be interested then only we can accept or reject 
        //only status are allowed accept or reject

        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status not allowed"});
        }

        const connectionRequest=await ConnectionRequest.findOne({//finding a connection in database which have sent a connection request to loggedin user
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        });
        if(!connectionRequest){
            return res.status(404).json({message:"Connection req not found"});
        }
        //if we found with above status and all then change the status from interested to acc or rej

        connectionRequest.status=status;//accepted or rejected

        const data=await connectionRequest.save();

        res.json({message:
        "connection"+ status,
        data
    });
    }catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
    const loggedInUser=req.user;
});

module.exports=requestRouter;




//in userauth we have already attached the user thats why we 
//here userauth as amiddleware getting a user