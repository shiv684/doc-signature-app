
const mongoose=require("mongoose")

const documentSchema=new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },

    originalName:{
        type:String,
        required:true
    },
    filepath:{
        type:String,
        // required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    status: { type: String, enum: ['pending', 'signed', 'rejected'], default: 'pending' },
    signeremail:{type:String},
    signingToken:{type:String}



},{timestamps:true})

module.exports=mongoose.model("Document",documentSchema)