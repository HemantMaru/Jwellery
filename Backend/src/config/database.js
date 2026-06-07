const mongoose = require("mongoose");

async function mongo_connect() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

  console.log("Connected to the database successfully.");
}

module.exports = mongo_connect;
