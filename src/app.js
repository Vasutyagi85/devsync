const express=require("express");
const connectDB=require("./config/database");
const app=express();
const cookieParser=require("cookie-parser");



app.use(express.json());//middleware for json conversion
app.use(cookieParser());//read cookies which is read by browser on every request


//import these router 
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);//if i fetch profile then it check auth does it contain/profile
app.use("/",requestRouter);//same first auth if not theb profile then reqquest
app.use("/",userRouter)


connectDB().then(()=>{
    console.log("db is connected");
    app.listen(3000,()=>{//listen to req
    console.log("server is running");
});//after connecting to db then calling to the server
})
.catch((err)=>{
    console.log("there might be some problem to connecting to the db")
});







































































// //get one user from database by email
// app.get("/user",async(req,res)=>{
//     const useremail=req.body.emailId;

//     try{//query for finding by emailid
//         const user=await User.find({emailId:useremail});//from the user model fetching the user which have the email id same as the requested one
//         if(user.length==0){
//             res.status(404).send("user not found");
//         }else{
//             res.send(user);
//         }
//     }
//     catch(err){
//         res.status(400).send("something send wrong");
//     }
// });

// //feed api get all user from database
// app.get("/feed",async(req,res)=>{
//     try{
//         const users=await User.find({});//passingg empty obj means all user
//         res.send(users);
//     } catch(err){
//         res.status(400).send("something went wrong")
//     }
// });

// //get user by email
// // app.get("/user",async(req,res)=>{
// //     const useremail=req.body.emailId;

// //     try{
// //     const user=await User.findOne({emailId:useremail});
// //     res.send(user);
// //     }catch(err){
// //         res.status(400).send("something went wrong")
// //     }
// // });

// app.delete("/user",async(req,res)=>{
//     const userid=req.body._id;

//     try{
//         const user=await User.findByIdAndDelete({_id:userid});

//     }catch(err){
//         res.status(400).send("something went wrong")
//     }
//     res.send("successfully deleted user");
// });


// //PATCH
// app.patch("/user/:userId",async(req,res)=>{
//     const userid =req.params?.userId;
//     const data=req.body;


//     try{

//         const ALLOWED_UPDATES=[
//             "photoUrl",
//             "about",
//             "gender",
//             "age",
//             "skills",
//         ];

//         const isUpdateAllowed=Object.keys(data).every((k)=>
//             ALLOWED_UPDATES.includes(k)
//         );

// //         .every((k) => … )
// // The .every() array method checks whether all elements in the array satisfy a given condition (the callback function).
// // It returns true only if every key passes the test.

//         if(!isUpdateAllowed){
//             throw new Error("Update not allowed");
//         }
//         if(data?.skills.length>10){
//             throw new error("cannot skills more than 10");
//         }

//         const user=await User.findByIdAndUpdate({_id:userid},data,{
//             returnDocument:"after",
//             runValidators:"true"
//         });
//         res.send("successfully updated user");
//     }catch(err){
//         res.status(400).send("something went wrong")
//     }

// })


