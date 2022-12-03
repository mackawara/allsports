const clientNumberModel=require("../models/clientNumber")

const savePlayer=async()=>{
    const clientNumber=await clientNumberModel.find({number:number}).exec().catch(err=>console.log(err))
}
