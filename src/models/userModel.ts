import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    image:{type:String},
    password:{type:String},
    googleId:{type:String},
})

export const User = mongoose.models?.User || mongoose.model("User",userSchema);