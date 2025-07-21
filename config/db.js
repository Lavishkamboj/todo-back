const mongoose = require("mongoose");
 // mongoURI
const connection = mongoose
  .connect(
    "mongodb+srv://lavishkamboj16:lavishkamboj16...@cluster0.1dmvo.mongodb.net/todoApp?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

module.exports = connection;
