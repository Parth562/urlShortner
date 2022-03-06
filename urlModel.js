const mongoose = require("mongoose");
const validator = require("validator");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "url is required for this schema.."],
    unique: [true, "Url must be unique...."],
  },
  urlIdentifier: {
    type: Number,
    required: [true, "url indetifier is required"],
    unique: [true, "url identifier must be unique...."],
  },
  shortUrl: {
    type: String,
    required: [true, "Url must be shortend...."],
    unique: [true, "Short url must be unique..."],
  },
});

const Urlmodel = mongoose.model("Urlmodel", urlSchema);
module.exports = Urlmodel;
