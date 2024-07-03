const express = require("express");
const courseController = require("../controllers/courseController");
const verifyMidleware = require("../middleware/verifyToken");

const router = express.Router();

/**
 * @swagger
 * /api/edu/create_new_course:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Tạo mới khóa học
 *     description: Tạo mới một khóa học trong hệ thống.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token của người dùng đã đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: "Lập trình hướng đối tượng"
 *               trainer:
 *                 type: string
 *                 example: "Th.s Vũ Văn Kiên"
 *               startedDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-23T00:00:00.000Z"
 *               endedDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-23T00:00:00.000Z"
 *               buildingId:
 *                 type: string
 *                 example: "66222378741fbe9d19f313b1"
 *               roomId:
 *                 type: string
 *                 example: "661f76bd810af8ed88ad17d5"
 *                 description: "Phòng học"
 *     responses:
 *       '200':
 *         description: Thành công
 *       '404':
 *         description: Không tìm thấy
 *       '500':
 *         description: Lỗi server
 */


router.post(
  "/create_new_course",
  verifyMidleware.verifyToken,
  courseController.createNewCourse
);
router.get(
  "/get_all_course",
  verifyMidleware.verifyToken,
  courseController.getAllCoursesForUser
);
router.put(
  "/edit_course",
  verifyMidleware.verifyToken,
  courseController.putInforOfCourse
);
router.delete(
  "/delete_course",
  verifyMidleware.verifyToken,
  courseController.deleteInforOfCourse
);

// router.get("/sort", postsController.getPostSort);
module.exports = router;
