const mongoose=require("mongoose")



const userSchema=mongoose.Schema({
    email:String,
    password:String
    // city:String,
    // search:[String]
})

const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}