const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: String,
  timeRequired: String,
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
