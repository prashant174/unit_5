const mongoose=require("mongoose")
require("dotenv").config()
const connection=mongoose.connect(process.env._url)


module.exports={
    connection
}