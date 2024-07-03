const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
  },
  ipGateway: {
    type: String,
  },
  ssid: {
    type: String,
  },
  location: {
    type: String,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
