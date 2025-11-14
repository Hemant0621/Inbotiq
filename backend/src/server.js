require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
