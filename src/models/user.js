const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password"+value);
            }
        },
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other"],
            message:`{value}is not a valid gender type `
        }
    },
    photoUrl:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg;"
    },
    about:{
        type:String,
        default:"this is a default about of the user"
    },
    skills:{
        type:[String]
    }
},{timestamps:true});

userSchema.index({firstName:1});//create index for executing query fast
userSchema.index({gender:1});

userSchema.methods.getJWT=async function(){
    const user=this;

    const token=await jwt.sign({_id:user._id},"DevVt@85699",{
    expiresIn:"1d",
    });

    return token;
};

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user =this;
    const passwordHash=this.password;

    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash)

    return isPasswordValid;
}




module.exports=mongoose.model("User",userSchema);//name of model, schema name