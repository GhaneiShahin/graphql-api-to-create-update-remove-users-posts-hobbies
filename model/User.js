const mongoose = require("mongoose");
const MSchema = mongoose.Schema;

const userSchema = new MSchema({
  name: String,
  lastName: String,
  age: Number,
});

module.exports = mongoose.model("User", userSchema);
