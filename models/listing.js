const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title : {
        type : String,
        required: true
    },
    description : {
        type : String
    },
    image: {
        filename: {
          type: String,
          default: "default_filename"
        },
        url: {
          type: String,
          default: "default_link",
          set: (v) => v === "" ? "default_link" : v
        }
      },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    }
});

const Listing = mongoose.model("listing" , listingSchema);
module.exports = Listing;