const lessonModel = require("../models/lessonModels");
const buildingModel = require("../models/buildingModel");
const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

const { date } = require("@hapi/joi");
const lessonController = {
  createNewLesson: async (req, res) => {
    try {
      const course = await courseModel.findById(req.body.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course node found" });
      }
      const user = await userModel.findById(req.user.userId);
      console.log("useruseruseruseruser", req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const building = await buildingModel
        .findById(req.body.buildingId)
        .populate("rooms");
      if (!building) {
        return res.status(404).json({ message: "Building not found" });
      }
      const room = building.rooms.find(
        (room) => room._id.toString() === req.body.roomId
      );
      if (!room) {
        return res.status(404).json({ message: "Room not found in building" });
      }

      // Tạo mới một buổi học mới
      const newLesson = new lessonModel({
        courseId: req.body.courseId,
        className: req.body.className,
        trainer: req.body.trainer,
        date: req.body.date,
        startedTime: req.body.startedTime,
        endedTime: req.body.endedTime,
        buildingId: req.body.buildingId,
        roomId: req.body.roomId,
        userId: req.user.userId,
      });
      console.log("newlesson", newLesson);
      await newLesson.save();
      res.status(200).json({
        resultCode: 1,
        message: "Tạo buổi học mới thành công !",
        data: newLesson,
      });
    } catch (error) {
      res.status(500).json({
        message: "Tạo buổi học không thành công",
        error: error.message,
      });
    }
  },
  getAllLessonsByCourse: async (req, res) => {
    try {
      const courses = await courseModel.find({ userId: req.user.userId });
      const courseId = req.query.courseId;
      // const userId = req.user.userId;
      console.log("const userId = req.user.userId;", courseId);
      // Lấy danh sách các khóa học của người dùng
      const userCourses = await courseModel.findById(courseId);
      console.log("userCourses", userCourses);
      // Kiểm tra xem người dùng có quyền truy cập vào khóa học không
      if (
        !userCourses ||
        userCourses.length === 0 ||
        !courses ||
        courses.length == 0
      ) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy buổi học dành cho khóa học này" });
      }

      // Tìm tất cả các buổi học có courseId tương ứng với courseId được truyền vào
      // và mà cũng thuộc về người dùng đó
      const lessons = await lessonModel.find({ courseId });
      console.log("lessons", lessons);
      // Trả về danh sách tất cả các buổi học theo khóa học của người dùng
      res.status(200).json({
        resultCode: 1,
        message: "Lấy thông tin buổi học theo khóa học thành công!",
        data: lessons,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to get lessons by user and course",
        error: error.message,
      });
    }
  },
  getAllLessonByUser: async (req, res) => {
    try {
      // Kiểm tra xem iduser có được gửi lên hay không và có hợp lệ không
      const userId = req.query.userId;
      console.log("userIduserId", userId);
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          resultCode: -1,
          message: "Id người dùng không hợp lệ",
        });
      }

      // Kiểm tra xem người dùng có tồn tại trong hệ thống hay không
      const user = await userModel.findById(userId);
      console.log("lessonslessons", user);
      if (!user) {
        return res.status(404).json({
          resultCode: -1,
          message: "Người dùng không tồn tại",
        });
      }

      // Nếu người dùng tồn tại, tiếp tục lấy thông tin các buổi học của họ
      const lessons = await lessonModel.find({ userId: userId });
      console.log("lessonslessons", lessons);
      if (!lessons || lessons.length === 0) {
        return res.status(404).json({
          resultCode: -1,
          message: "Người dùng chưa có buổi học nào",
        });
      }
      if (req.user.userId !== req.query.userId) {
        return res.status(403).json({
          resultCode: -1,
          message: "Người dùng này không có quyền xem",
        });
      }
      
      console.log(
        "req.user.userId != req.query.userId",
        req.user.userId,req.query.userId
      );
      res.status(200).json({
        resultCode: 1,
        message: "Lấy thông tin buổi học thành công !",
        data: lessons,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to get lessons by user",
        error: error.message,
      });
    }
  },

  putInforLesson: async (req, res) => {
    try {
      const courses = await courseModel.find({ userId: req.user.userId });
      console.log("courses", req.user.userId);
      const classId = req.body.classId;
      const {
        className,
        trainer,
        date,
        startedTime,
        endedTime,
        buildingId,
        roomId,
      } = req.body;

      // Kiểm tra xem buổi học có tồn tại không
      const existingLesson = await lessonModel.findById(classId);
      if (
        !existingLesson ||
        existingLesson.length == 0 ||
        !courses ||
        courses.length == 0
      ) {
        return res.status(400).json({
          resultCode: -1,
          message: "Không tồn tại buổi học này trong hệ thống !",
          data: null,
        });
      }

      // Cập nhật thông tin buổi học
      existingLesson.className = className;
      existingLesson.trainer = trainer;
      existingLesson.date = date;
      existingLesson.startedTime = startedTime;
      existingLesson.endedTime = endedTime;
      existingLesson.buildingId = buildingId;
      existingLesson.roomId = roomId;
      existingLesson.last_modified = Date.now();

      const updatedLesson = await existingLesson.save();

      // Trả về kết quả thành công
      res.json({
        resultCode: 1,
        message: "Sửa thông tin buổi học thành công !",
        data: {
          courseId: updatedLesson.courseId,
          className: updatedLesson.className,
          trainer: updatedLesson.trainer,
          date: updatedLesson.date,
          startedTime: updatedLesson.startedTime,
          endedTime: updatedLesson.endedTime,
          code: updatedLesson.code,
          room_id: updatedLesson.roomId,
          building_id: updatedLesson.buildingId,
          last_modified: updatedLesson.last_modified,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        resultCode: -1,
        message: "Đã xảy ra lỗi khi cập nhật thông tin buổi học",
        data: null,
      });
    }
  },
  deleteInforOfLesson: async (req, res) => {
    try {
      const courses = await courseModel.find({ userId: req.user.userId });
      console.log("courses", req.user.userId);
      const lessonId = req.query.lessonId;
      console.log("lessonIdlessonIdlessonIdlessonId", lessonId);
      const deleteLesson = await lessonModel.findByIdAndDelete(lessonId);
      if (
        !deleteLesson ||
        deleteLesson.length == 0 ||
        !courses ||
        courses.length == 0
      ) {
        return res.status(404).json({
          resultCode: -1,
          message: "Không tìm thấy khóa học để xóa",
          data: null,
        });
      }
      res.json({
        resultCode: 1,
        message: "Xóa buổi học thành công",
        data: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        resultCode: -1,
        message: "Đã xảy ra lỗi khi xóa khóa học",
        data: null,
      });
    }
  },
};
module.exports = lessonController;
