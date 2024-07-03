
const express = require('express');
const verifyMidleware = require('../middleware/verifyToken');
const buildingController= require ("../controllers/buildingController");
const { route } = require('./courseRouter');
const router = express.Router();

router.post("/create_new_building", verifyMidleware.verifyToken,buildingController.createNewBuilding);
router.get("/get_building",verifyMidleware.verifyToken,buildingController.getAllBuildingRoom);

// router.get("/sort", postsController.getPostSort);
module.exports = router;
