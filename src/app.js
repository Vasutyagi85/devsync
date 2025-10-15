const express=require("express");

const app=express();

app.get("/user",(req,res)=>{
    res.send("this is the data from db");
})

app.post("/user",(req,res)=>{
    res.send("update to the database");
})

app.delete("/user",(req,res)=>{
    res.send("sccessfully deleted data");
})

app.use("/test",(req,res)=>{//request handler
    res.send("hello from server")
})

app.listen(3000,()=>{//listen to req
    console.log("server is running");
});