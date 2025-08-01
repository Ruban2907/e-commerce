const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./config/connect"); 
const authRoute = require("./routes/allroutes");
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

app.use("/",authRoute);

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: error.message 
  });
});

const server = app.listen(PORT,()=> {
    console.log(`Server started at port: ${PORT}`);
})