/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const adminService = require('../service/admin.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');
const jwt = require('jsonwebtoken');
async function register(req, res, next) {
    try {
        // Lấy thông tin từ request body
        const { name, password } = req.body;

        // Kiểm tra nếu thiếu thông tin
        if (!name || !password) {
            throw new ApiError(400, 'Thiếu thông tin đăng ký');
        }

        // Kiểm tra xem name đã tồn tại trong DB chưa
        const isNameExists = await adminService.checkAdminNameExists(name);
        if (isNameExists) {
            return res.status(400).json({ message: 'Tên admin đã tồn tại' });
        }

        // Lấy đường dẫn ảnh (nếu có)
        const image_url = req.file ? `/public/img_admin/${req.file.filename}` : null;

        // Gọi service để thực hiện đăng ký
        const newAdmin = await adminService.register({ name, password, image_url });

        // Trả về kết quả thành công
        res.status(201).json(JSend.success(newAdmin));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while registering the admin')) // Gọi middleware xử lý lỗi
    }
}

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function login(req, res, next) {
  
  try {
    const { name, password } = req.body;
    console.log(name, password);
    // Xác thực admin
    const admin = await adminService.authenticate(name, password);
    console.log(admin);
    if (!admin) {
      return next(new ApiError(401, 'Username or password is incorrect'));
    }
    if (!process.env.SECRET_KEY) {
      return next(new ApiError(500, 'Secret key not defined'));
    }
    // Tạo token JWT
    const token = jwt.sign(
      { admin_id: admin.admin_id, name: admin.name },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    // Phản hồi thành công với token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while logging in')); 
  }
}
// admin.controller.js
async function logout(req, res, next) {
  try {
    // Kiểm tra xem admin đã đăng nhập hay chưa
    if (!req.admin) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    // Xóa token JWT khỏi header
    req.header('Authorization', null);
    // Trả về phản hồi thành công
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while logging out'));
  }
}
function getAdmin(req,res,next){ 
    return res.json(JSend.success({ token: 'token' }));
}
function updateAdmin(req,res,next){
    return res.json(JSend.success({ token: 'token' }));
}

// eslint-disable-next-line no-undef
module.exports = {
    register,
    login,
    getAdmin,
    updateAdmin,
    logout
};

