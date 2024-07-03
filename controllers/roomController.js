const rommModel= require("../models/rommModel")
const courseController = {
  createNewRoom: async (req, res) => {
    try {
      // Tạo mới một khóa học
      const newRoom = rommModel({
        roomName: req.body.roomName,
        ipGateway: req.body.ipGateway,
        ssid: req.body.ssid,
        location: req.body.location,
      });
      console.log("courseModel", newRoom);
      // Lưu khóa học vào cơ sở dữ liệu
      await newRoom.save();
      // Trả về thông tin khóa học đã tạo
      res.status(200).json({
        resultCode: 1,
        message: "Tạo phòng học học mới thành công !",
        data: {
            roomId: newRoom._id,
            roomName: req.body.roomName,
            ipGateway: req.body.ipGateway,
            ssid: req.body.ssid,
            location: req.body.location,
        },
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      res
        .status(500)
        .json({ message: "Failed to create course", error: error.message });
    }
  },
};

module.exports = courseController;
