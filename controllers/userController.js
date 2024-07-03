// userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const Joi = require("@hapi/joi");
// const enrollmentModel = require("../models/enrollmentModel");
const userController = {
  //Login

  //insert account
  insertUser: async (req, res) => {
    // Đánh dấu hàm là async
    try {
      // Định nghĩa schema để kiểm tra dữ liệu đầu vào
      const schema = Joi.object({
        username: Joi.string().min(5).max(30).required(),
        password: Joi.string().min(5),
      });

      // Kiểm tra dữ liệu đầu vào có hợp lệ không
      const validation = schema.validate(req.body);
      if (validation.error) {
        return res
          .status(400)
          .json({ error: validation.error.details[0].message });
      }

      // Kiểm tra xem người dùng đã tồn tại chưa
      const existingUser = await userModel.findOne({
        username: req.body.username,
      });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      console.log("Mật khẩu:", hashedPassword);
      // Tạo một người dùng mới
      const newUser = new userModel({
        username: req.body.username,
        password: hashedPassword,
      });
      console.log("ghioquưy:", newUser);
      // Lưu người dùng mới vào cơ sở dữ liệu
      await newUser.save();
      // const newEnrollment= new enrollmentModel({
      //   userId: newUser._id,
      //   courseId: req.body.courseId,
      // })
      // await newEnrollment.save();
      res.status(201).json({ message: "User created successfully",data:newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  loginUser: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        statusCode: 0,
        message: "Missing value username or password.",
      });
    }
    console.log("Hashed password from request:", bcrypt.hashSync(password, 12));
    userModel
      .findOne({ username: username })
      .then((user) => {
        if (!user) {
          return res.status(200).json({
            statusCode: 0,
            message: "User is not exist.",
          });
        }
        console.log("password của sever:", user);
        console.log("Password:", password);
        console.log("User password:", user.password);
        console.log(bcrypt.compareSync(password, user.password));
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(200).json({
                statusCode: 0,
                message: "Your password is not correct.",
              });
            }

            const payload = {
              userId: user._id,
              username: user.username,
            };
            jwt.sign(
              payload,
              "yourSecretKey",
              { expiresIn: "1h" },
              (err, token) => {
                if (err) {
                  return res.status(500).json({
                    statusCode: 0,
                    message: "Failed to generate token.",
                  });
                }
                res.status(200).json({
                  statusCode: 1,
                  message: "Login successfully!",
                  data: {
                    token: token,
                    userId: "0",
                    etmsId: "null",
                    etmsToken: "null",
                    employeeId: "null",
                    username: user.username,
                    fullName: "null",
                    email: "null",
                    avatarUrl: null,
                    deviceStatus: 1,
                    eduRole: "admin",
                    medicalStatus: "true",
                    formTitle: "null",
                    adminRole: "false",
                    olympic: "false",
                    iPaper: "iPaper",
                    stayInterview: "false",
                    eCheck: "true",
                    gridItemFunctions: [
                      {
                        key: 1713174136684,
                        stackName: "",
                        type: 0,
                        title: "Triển lãm Happy Days",
                        icon: "public/image/ic_happy_day.png",
                        typeIcon: "url",
                        color: "#f070a1",
                        isNew: true,
                        tag: "HappyDay",
                      },
                      {
                        key: "64da5d9846258620c531650c",
                        stackName:
                          "",
                        type: 0,
                        title: "113 Cups",
                        icon: "public/image/lg_113cup.png",
                        typeIcon: "url",
                        color: "#f070a1",
                        isNew: true,
                        tag: "113Cup",
                      },
                      {
                        key: 1713174136683,
                        stackName: "ApproveNow",
                        type: 2,
                        title: "Approve Now",
                        icon: "public/image/lg_approve_now.png",
                        typeIcon: "url",
                        color: "#f070a1",
                        isNew: true,
                        tag: "ApproveNow",
                      },
                    ],
                    ePurchase_api: "",
                    ePayment_api: "",
                    key_ePurchase_ePayment: "",
                    key_ePayment: "",
                    key_ePurchase: "",
                  },
                });
              }
            );
          })
          .catch((err) => {
            return res.status(500).json({
              statusCode: 0,
              message: "Failed to compare passwords.",
            });
          });
      })

      .catch((err) => {
        return res.status(500).json({
          statusCode: 0,
          message: "Failed to find user.",
        });
      });
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.query.userId;
      
      // Kiểm tra xem userId có tồn tại không
      if (!userId) {
        return res.status(400).send("Missing userId");
      }
  
      // Tìm và xóa người dùng
      const deletedUser = await userModel.findByIdAndDelete(userId);
  
      // Kiểm tra xem người dùng có tồn tại không
      if (!deletedUser) {
        return res.status(404).send("User not found");
      }
  
      // Trả về kết quả thành công
      res.status(200).send("User deleted successfully");
    } catch (error) {
      // Bắt lỗi nếu có lỗi xảy ra trong quá trình xóa
      res.status(500).send(error.message);
    }
  },
  

  updateUser: async (req, res) => {
    try {
      const userId = req.query.userId;
      console.log("useruserIdwwwwww",userId);

      if (!userId) {
        return res.status(400).send("Missing userId");
      }

      // Kiểm tra xem liệu cần cập nhật username hoặc password
      if (!req.body.username && !req.body.password) {
        return res
          .status(400)
          .send("Username or password is required for update");
      }

      // Hash mật khẩu nếu được cung cấp
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      }

      // Cập nhật người dùng
      const updatedUser = await userModel.findByIdAndUpdate(userId, req.body);

      if (!updatedUser) {
        // Nếu không tìm thấy người dùng để cập nhật
        return res.status(404).send("User not found");
      }

      res.status(200).send("User updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
    }
  },
};

module.exports = userController;
