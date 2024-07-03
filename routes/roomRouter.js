
const express = require('express');
const verifyMidleware = require('../middleware/verifyToken');
const roomController = require("../controllers/roomController")

const router = express.Router();

router.post("/create_new_room", verifyMidleware.verifyToken, roomController.createNewRoom);


// router.get("/sort", postsController.getPostSort);
module.exports = router;
