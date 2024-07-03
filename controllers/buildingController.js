const buildingModel = require("../models/buildingModel");

const buildingController = {
  createNewBuilding: async (req, res) => {
    try {
      const newBuilding = new buildingModel({
        buildingName: req.body.buildingName,
        rooms: req.body.rooms
      });

      await newBuilding.save();

      // Lấy thông tin về tên của các phòng
      const buildingWithRoomNames = await buildingModel.findById(newBuilding._id).populate('rooms');

      res.status(200).json({
        resultCode: 1,
        message: "Tạo tòa nhà mới thành công!",
        data: buildingWithRoomNames // Trả về thông tin về building với roomName của mỗi phòng
      });
    } catch (error) {
      res.status(500).json({
        message: "Tạo phòng học không thành công",
        error: error.message,
      });
    }
  },
  getAllBuildingRoom: async(req, res)=>{
    try {
      const allBuildingsWithRooms = await buildingModel.find().populate('rooms');

      res.status(200).json({
        resultCode: 1,
        message: "Lấy thông tin phòng học thành công!",
        data: allBuildingsWithRooms 
      });
    } catch (error) {
      res.status(500).json({
        message: "Lấy thông tin phòng học không thành công",
        error: error.message,
      });
    }
  }
};

module.exports = buildingController;
