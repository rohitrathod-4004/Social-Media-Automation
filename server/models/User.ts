import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    email:{ type: String , required: true , unique:true },
    password:{type:String , required:true},
    name: { type: String, required: true },
    zernioProfileId: { type: String }
} , {timestamps:true});

export const User = mongoose.model("User" , userschema);