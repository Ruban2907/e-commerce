//require('dotenv').config();
const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./config/connect"); 
const loginRoute = require("./routes/authroute");
const regRoute = require("./routes/registerroute");
const cors = require('cors')

const app = express();
const PORT = 8002;
app.use(express.json());
app.use(cors());

connectToMongoDB(process.env.MONGODB ?? "mongodb://localhost:27017/e-commerce").then(() =>
  console.log("Mongodb connected")
);

app.use((req,res,next)=>{
  console.log(req.url,req.method,req.body)
  next()
})

app.use("/login",loginRoute);
app.use("/signup",regRoute);

app.listen(PORT,()=> {
    console.log(`Server started at port: ${8002}`);
})