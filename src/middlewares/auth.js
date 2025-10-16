const adminauth=(req,res,next)=>{//starting from admin all api will be handled by this middleware
    const token="xyz";
    const istokenauthorized=token==="xyz";
    if(!istokenauthorized){
        res.status(401).send("unauthorized request");
    }else{
        next();
    }
};

module.exports={
    adminauth,
}