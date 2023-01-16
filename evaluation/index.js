const express=require("express")
const {connection}=require("./config/db")
const Redis=require("ioredis")
const jwt=require("jsonwebtoken")
const {UserModel}=require("./model/user.model")
require('dotenv').config()
const bcrypt=require("bcrypt")
const {transports,format} = require('winston')
const expressWinston = require('express-winston')
require('winston-mongodb')
const app=express()

const port=process.env.port||8080
const redis=new Redis()

app.use(expressWinston.logger({
    transports:[
        new transports.Console({
            json:true,
            colorize:true,
            level:"error"
        }),
        new transports.File({
            level:"warn",
            filename:"warninglogs.log"
        }),
        new transports.MongoDB({
            db:process.env._url,
            level:"error"
        })
    ],
    format:format.combine(
        format.json(),
        format.timestamp(),
        format.prettyPrint()
     ),
     statusLevels:true
}))
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("welcome")
})

app.post("/signup",(req,res)=>{
  const {email,password}=req.body
  bcrypt.hash(password, 6,async function(err, hash) {
    // Store hash in your password DB.
    if(err){
    res.send("something went wtrong")
    }
    const user=new UserModel({email,password:hash})
    await user.save()
    res.status(201).send("signup successfull")
});
})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body

    const user=await UserModel.findOne({email})
    const hashed_password=user?.password

    if(user.emal){
        bcrypt.compare(password, hashed_password, function(err, result) {
            // result == true
            if(result){
                const token = jwt.sign({ email,id:user._id }, process.env.secret,{expiresIn:100000});
                const refreshToken=jwt.sign(
                    {id:user._id},
                    process.env.refresh,
                    {expiresIn:200000}
                )
                res.status(200).send({"msg":"login successfull","token":token,"refresh":refreshToken})
            }
            else{
                res.send("wrong details")
            }
        });
    }
    else{
        res.status(401).send("invalid credentials")
    }
})

app.get("/logout",(req,res)=>{
    const token=req.headers?.authorization?.split(' ')[1]
let blacklistdata;
    redis.get("u5c4s",(err,result)=>{
        if(err){
            console.log(err)
        }
blacklistdata=result
    })
    res.send("loggedout successfully")
    
})



app.listen(port,async()=>{
    try{
    await connection
    console.log("connected to db")
    }
    catch(err){
        console.log(err)
    }
    console.log(`listening on port ${port}` )
})
