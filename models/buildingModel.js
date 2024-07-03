const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  buildingName: {
    type: String,
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
});

const Building = mongoose.model("building", buildingSchema);

module.exports = Building;
