const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB(url) {
  if (!url) {
    throw new Error("MONGODB_URI is not defined");
  }
  return mongoose.connect(url);
}

module.exports = {
  connectToMongoDB,
};

