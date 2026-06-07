
const mongoose=require("mongoose");

const connectedDB=async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI);
       console.log("mongodb connected");
    }
    catch(err){
        console.error(err);
        process.exist(1);
    }
}

module.exports=connectedDB