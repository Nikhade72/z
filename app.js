const express = require("express");
const app= new express();
const mongoose=require("mongoose");
const morgan =require("morgan");
const cors=require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

require("dotenv").config();
app.use(morgan("dev"));
app.use(cors());
const nodemailer = require('nodemailer');
app.use(bodyParser.json());


const signup=require("./routes/signup");
app.use("/api",signup)
const admin=require("./routes/admin")
app.use("/api",admin)
const movie=require("./routes/movie")
app.use("/api",movie)
const email = require('./routes/email'); 
app.use('/api', email);
URL=process.env.URL;
PORT=process.env.PORT;


mongoose.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    app.listen(PORT,()=>{
       console.log("SERVER IS RUNNING IN THE PORT "+PORT);
       console.log("Connected to atlas");
    })

})
.catch((e)=>console.log(e));
