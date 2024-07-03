// userModel.js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses" // Tham chiếu tới model "courses"
  },
  lessonsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  }

});




const userModel = mongoose.model("users", UserSchema);

module.exports = userModel;
