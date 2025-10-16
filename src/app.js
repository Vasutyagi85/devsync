const express=require("express");
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");

app.post("/signUp",async(req,res)=>{
    //creating a new instance of new user type of user schema defined in models
    const newUser=new User({
        firstName:"Virat",
        lastName:"Kohli",
        emailId:"ViratKohli@gmail.com",
        password:"vasu@123"
    });

    try{
        await newUser.save();
        res.send("user added successfully");
    }catch (err){
        res.status(400).send("error saving the user"+err.message);
    }
})


connectDB().then(()=>{
    console.log("db is connected");
    app.listen(3000,()=>{//listen to req
    console.log("server is running");
});//after connecting to db then calling to the server
})
.catch((err)=>{
    console.log("there might be some problem to connecting to the db")
});