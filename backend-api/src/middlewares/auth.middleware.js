/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization'); // Lấy token từ header 'Authorization' và trim token

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập' }); // Trả về lỗi nếu chưa có token
  }

  // Kiểm tra xem token có hợp lệ hay không
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token không hợp lệ' }); // Trả về lỗi nếu token không hợp lệ
  }

  const tokenValue = token.substring(7); // Lấy giá trị token

  // Kiểm tra xem SECRET_KEY có được định nghĩa hay không
  if (!process.env.SECRET_KEY) {
    return res.status(500).json({ message: 'SECRET_KEY không được định nghĩa' }); // Trả về lỗi nếu SECRET_KEY không được định nghĩa
  }

  try {
    // Giải mã và xác thực token
    const decoded = jwt.verify(tokenValue, process.env.SECRET_KEY); // Sử dụng SECRET_KEY để giải mã token

    // Gắn thông tin người dùng đã xác thực vào đối tượng req để dùng trong các hàm sau
    req.admin = decoded;

    // Chuyển sang middleware hoặc route handler tiếp theo
    next();
  } catch (error) {
    console.log(error); // Log lỗi để debug nếu cần
    return res.status(401).json({ message: 'Token không hợp lệ' }); // Trả về lỗi nếu token không hợp lệ
  }
};

module.exports = authenticate;