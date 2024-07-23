const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB form index.js");
  })
  .catch((err) => {
    console.log(err);
  });

  async function main() {
    await mongoose.connect(MONGO_URL);
  }

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data from Data.js has been initialized and old data has been removed");
    await mongoose.disconnect();

}

initDB();

  