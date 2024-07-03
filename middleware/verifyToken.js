// verifyToken.js
const jwt = require("jsonwebtoken");
const verifyMidleware = {
  verifyToken: (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, "yourSecretKey", function (err, user) {
        if (err) {
          return res.status(403).json({
            resultCode: -1,
            message:
              "Phiên truy cập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng",
            data: "null",
          });
        }
        console.log("userverifytoken", user);
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({
        resultCode: -1,
        messag: "Không tìm thấy người dùng này !",
        data: "null",
      });
    }
  },
};

module.exports = verifyMidleware;
