const mongoose=require("mongoose")
const tokensSchema=mongoose.Schema({
    pageToken:{
        Type:String,
        required:true
    }
})
const tokenModel=new mongoose.model("pageToken",tokensSchema)
module.exports={tokenModel}