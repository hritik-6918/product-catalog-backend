const mongoose = require("mongoose");
const Product = require("./models/Product");
const data = require("./products.json"); // Copy your JSON here

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    await Product.insertMany(data);
    console.log("Data seeded");
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
