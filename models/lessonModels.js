const { string } = require("@hapi/joi");
const mongoose = require ("mongoose")
const LessonSchema= new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses" // Tham chiếu tới model "users"
      },
      className:{
        type: String,
        require:true
      },
      trainer:{
        type: String,
      },
      startedTime: {
        type: String,
      },
      endedTime: {
        type: String,
      },
      buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "building" // Tham chiếu tới model "users"
      },
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room" // Tham chiếu tới model "users"
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users" // Tham chiếu tới model "users"
      },
      last_modified:{
        type:Date,
        default:Date.now
      }
      
})
const lessonModel = mongoose.model("lessons", LessonSchema);

module.exports = lessonModel;
