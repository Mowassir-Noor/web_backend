import mongoose from "mongoose";

// also have to add regex for email and password and also have to add unique for email

const userSchema= new mongoose.Schema({
    name:{type:String,required:[true,"Name is required"]},
    email:{type:String,required:[true,"Email is required"],unique:true},
    password:{type:String,required:[true,"Password is required"]},
    role:{type:String,default:"job_seeker",enum:["job_seeker", "recruiter", "admin"]},
    bio:{type:String},
    location:{type:String},
    resumeUrl:{type:String},
    createdAt:{type:Date,default:Date.now}

});


const User= mongoose.model("User",userSchema);

export default User;