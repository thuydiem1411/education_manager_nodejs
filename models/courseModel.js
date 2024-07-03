// userModel.js

const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
  },
  trainer: {
    type: String,
  },
  startedDate: {
    type: Date,
  },
  endedDate: {
    type: Date,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users" // Tham chiếu tới model "users"
  },
  buildingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "building" // Tham chiếu tới model "users"
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room" // Tham chiếu tới model "users"
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_modified: {
    type: Date,
    default: Date.now,
  },
});

const courseModel = mongoose.model("courses", CourseSchema);

module.exports = courseModel;
