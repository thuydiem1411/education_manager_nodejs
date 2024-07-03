
const express = require('express');
const userController = require('../controllers/userController');
const verifyMidleware = require('../middleware/verifyToken');

const router = express.Router();
/**
 * @swagger
 * /api/insert:
 *   post:
 *     summary: Login a user
 *     description: Login a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'tranvana'
 *               password:
 *                 type: string
 *                 example: 'tranvana'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Invalid credentials or user not found
 */
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: post a user
 *     description: Login a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'tranvana'
 *               password:
 *                 type: string
 *                 example: 'tranvana'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Invalid credentials or user not found
 */


/**
 * @swagger
 * /api/delete:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their user ID.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: '6627746abbbc3ea15ea97bfc'
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '400':
 *         description: Missing userId
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/update:
 *   put:
 *     summary: Update a user
 *     description: Update a user's information (username and/or password) by their user ID.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: '6627803fdb6910b3101c9e9b'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'user1@gmail.com'
 *               password:
 *                 type: string
 *                 example: 'newpassword'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Missing userId or Username/password is required for update
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

router.post("/login", userController.loginUser);
router.post("/insert",userController.insertUser);
router.delete("/delete",verifyMidleware.verifyToken, userController.deleteUser)
router.put("/update", verifyMidleware.verifyToken, userController.updateUser)


// router.get("/sort", postsController.getPostSort);
module.exports = router;
