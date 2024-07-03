const courseModel = require("../models/courseModel");
const buildingModel = require("../models/buildingModel");
const rommModel = require("../models/rommModel");
const userModel = require("../models/userModel");

const courseController = {
  createNewCourse: async (req, res) => {
    try {
      // Tìm thông tin về building và room
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
      const user = await userModel.findById(req.user.userId);
      console.log("useruseruseruseruser", req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("useruseruseruseruser", user);
      // Tạo mới một khóa học
      const newCourse = new courseModel({
        courseName: req.body.courseName,
        trainer: req.body.trainer,
        startedDate: req.body.startedDate,
        endedDate: req.body.endedDate,
        buildingId: req.body.buildingId,
        roomId: req.body.roomId,
        userId: req.user.userId,
      });
      console.log("newCourse", newCourse);
      // Lưu khóa học vào cơ sở dữ liệu
      await newCourse.save();

      // Trả về thông tin khóa học đã tạo
      res.status(200).json({
        resultCode: 1,
        message: "Tạo khoá học mới thành công!",
        data: {
          courseId: newCourse._id,
          courseName: req.body.courseName,
          trainer: req.body.trainer,
          startedDate: req.body.startedDate,
          endedDate: req.body.endedDate,
          buildingName: building.buildingName,
          roomName: room ? room.roomName : null,
        },
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      res
        .status(500)
        .json({ message: "Failed to create course", error: error.message });
    }
  },
  getAllCoursesForUser: async (req, res) => {
    try {
      const courses = await courseModel.find({ userId: req.user.userId });

      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: "Courses not found" });
      }

      // Mảng để lưu trữ thông tin về các khóa học với thông tin về tòa nhà và phòng học
      const coursesWithBuildingAndRoomInfo = [];

      // Lặp qua từng khóa học và lấy thông tin về tòa nhà và phòng học cho mỗi khóa học
      for (const course of courses) {
        const building = await buildingModel.findById(course.buildingId);
        const room = await rommModel.findById(course.roomId);

        // Thêm thông tin về tòa nhà và phòng học vào mỗi khóa học
        const courseWithBuildingAndRoomInfo = {
          course_id: course._id,
          courseName: course.courseName,
          trainer: course.trainer,
          startedDate: course.startedDate,
          endedDate: course.endedDate,
          buildingId: course.buildingId,
          buildingName: building ? building.buildingName : null,
          roomId: course.roomId,
          roomName: room ? room.roomName : null,
          userId: course.userId,
          __v: course.__v,
        };

        // Thêm khóa học với thông tin về tòa nhà và phòng học vào mảng kết quả
        coursesWithBuildingAndRoomInfo.push(courseWithBuildingAndRoomInfo);
      }

      // Trả về danh sách các khóa học với thông tin về tòa nhà và phòng học
      res.status(200).json({
        message: "Get all courses for user successfully",
        data: coursesWithBuildingAndRoomInfo,
      });
    } catch (error) {
      console.error("Error getting courses for user:", error);
      res.status(500).json({
        message: "Failed to get courses for user",
        error: error.message,
      });
    }
  },
  putInforOfCourse: async (req, res) => {
    try {
      const courses = await courseModel.find({ userId: req.user.userId });
      console.log("courses",req.user.userId)
      const courseId = req.body.courseId;
      console.log("courseId",courseId)
      const {
        courseName,
        trainer,
        startedDate,
        endedDate,
        buildingId,
        roomId
      } = req.body;
  
      // Kiểm tra xem khóa học có tồn tại không
      const existingCourse = await courseModel.findById(courseId);
      console.log("existingCourse",existingCourse)
      if (!existingCourse||existingCourse.length==0||!courses||courses.length==0) {
        return res.status(404).json({
          resultCode: -1,
          message: "Không tồn tại khoá học này trong hệ thống !",
          data: null
        });
      }
  
      // Cập nhật thông tin khóa học
      existingCourse.courseName = courseName;
      existingCourse.trainer = trainer;
      existingCourse.startedDate = startedDate;
      existingCourse.endedDate = endedDate;
      existingCourse.buildingId = buildingId;
      existingCourse.roomId = roomId;
      existingCourse.last_modified = Date.now();
  
      // Lưu lại thông tin cập nhật vào cơ sở dữ liệu
      const updatedCourse = await existingCourse.save();
  
      // Trả về kết quả thành công
      res.json({
        resultCode: 1,
        message: "Sửa thông tin khoá học thành công !",
        data: updatedCourse
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        resultCode: -1,
        message: "Đã xảy ra lỗi khi cập nhật thông tin khoá học",
        data: null
      });
    }
  },
  deleteInforOfCourse: async(req,res)=>{
    try{
      const courses = await courseModel.find({ userId: req.user.userId });
      console.log("courses",req.user.userId)
      const courseId= req.query.courseId
      const deleteCourse= await courseModel.findByIdAndDelete(courseId)
      if(!deleteCourse|| deleteCourse.length==0||!courses||courses.length==0){
        return res.status(404).json({
          resultCode: -1,
          message: "Không tìm thấy khóa học để xóa",
          data: null
        });
      }
      res.json({
        resultCode: 1,
        message: "Xóa khóa học thành công",
        data: null
      });
    }
    catch(error)
    {
      console.error(error);
    res.status(500).json({
      resultCode: -1,
      message: "Đã xảy ra lỗi khi xóa khóa học",
      data: null
    });
    }
  }
};

module.exports = courseController;
