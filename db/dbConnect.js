const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to Database successfully"))
    .catch((err) => {
      console.log("Error connecting to Database");
      console.error(err);
    });
}

module.exports = dbConnect;
