const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: String,
  timeRequired: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
