const express = require("express");
const verifyMidleware = require("../middleware/verifyToken");
const lessonController = require("../controllers/lessonController");

const router = express.Router();

router.post(
  "/create_new_class",
  verifyMidleware.verifyToken,
  lessonController.createNewLesson
);
router.get(
  "/get_class_by_course",
  verifyMidleware.verifyToken,
  lessonController.getAllLessonsByCourse
);
router.get(
  "/get_class_by_user",
  verifyMidleware.verifyToken,
  lessonController.getAllLessonByUser
);
router.put(
  "/edit_class",
  verifyMidleware.verifyToken,
  lessonController.putInforLesson
);
router.delete("/delete_class",verifyMidleware.verifyToken,lessonController.deleteInforOfLesson)
// router.get("/sort", postsController.getPostSort);
module.exports = router;
