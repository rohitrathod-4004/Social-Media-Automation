import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref:"User" , required:true},
    generation : {type: mongoose.Schema.Types.ObjectId, ref:"Generation"},
    content : {type:String , required:true},
    mediaUrl : {type:String},
    mediaType : {type:String , enum:["image", "video"]},
    scheduledFor : {type:Date},
    platforms : {
        type:[{
            type:String,
            enum:["twitter", "linkedin", "facebook", "instagram" , "facebook_page","linkedin_page","instagram_business"]
        }]
    },
    failureReason: { type: String },
    failedAt: { type: Date },
    retryCount: { type: Number, default: 0 },
    status:{type:String  , enum:["draft", "scheduled", "published", "failed"] , default:"scheduled"},

} , {timestamps:true});

export const Post = mongoose.model("Post" , postSchema);