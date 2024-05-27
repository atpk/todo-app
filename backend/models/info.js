const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
});

const Info = mongoose.model("Info", infoSchema);

module.exports = Info;
