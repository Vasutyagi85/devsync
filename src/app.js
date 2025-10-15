const express=require("express");

const app=express();


app.use("/hello",(req,res)=>{
    
})
app.use("/test",(req,res)=>{//request handler
    res.send("hello from server")
})

app.listen(3000,()=>{//listen to req
    console.log("server is running");
});