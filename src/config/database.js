const mongoose=require('mongoose');

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://kelwin:131422@cluster0.dyfk451.mongodb.net/"//after last slash write cluster name to connect to specific cluster
    );
};
module.exports=connectDB;
