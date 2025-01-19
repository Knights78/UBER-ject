const express=require('express')
const app=express()
const dotenv=require('dotenv')
const userRoutes=require('./routes/user.routes');
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // Add this middleware
dotenv.config()
const cors=require('cors')

app.use(cors());
app.use(express.json())
app.use(express.urlencoded(({extended:true})));

const connectToDb=require('./db/db')
connectToDb()
app.get('/',(req,res)=>{
    res.send("Hello world")
})
app.use('/users',userRoutes)
module.exports=app
// 8OigZzIaR0ube3Qq