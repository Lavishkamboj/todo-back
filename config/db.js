const mongoose = require("mongoose");

const connection = mongoose
  .connect(
    "mongodb://localhost:27017/todo",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

module.exports = connection;
