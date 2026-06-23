require("dotenv").config();
const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./config/connect"); 
const authRoute = require("./routes/allroutes");
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 8002;
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

connectToMongoDB(process.env.MONGODB_URI).then(() =>
  console.log("Mongodb connected")
).catch((err) => {
  console.error("Mongodb connection error:", err);
  process.exit(1);
});

app.use((req,res,next)=>{
  console.log(req.url,req.method,req.body)
  next()
})

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running" });
});

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