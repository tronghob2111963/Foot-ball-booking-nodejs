/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const ApiError = require('../api-error');
const JSend = require('../jsend');
const jwt = require('jsonwebtoken');
const usersService = require('../service/users.service');


async function registerUser(req, res, next) {
  try {
    // Lấy thông tin từ request body
    const { name, password, email, phone } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!name || !password || !email || !phone) {
      throw new ApiError(400, 'Thiếu thông tin đăng ký');
    }

    const isPhoneExists = await usersService.checkUserPhoneExists(phone);
    // if (isEmailExists) {
    //   return res.status(400).json({ message: 'Email đã tồn tại' });
    // }
     if (isPhoneExists) {
      return res.status(400).json({ message: 'phone đã tồn tại' });
    }
    // Lấy đường dẫn ảnh (nếu có)
    const image_url = req.file ? `/public/img_user/${req.file.filename}` : null;

    // Gọi service để thực hiện đăng ký
    const newUser = await usersService.registerService({ name, password, email, phone, image_url });

    // Trả về kết quả thành công
    res.status(201).json(JSend.success(newUser));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while registering the user')) // Gọi middleware xử lý lỗi
  }
}


async function loginUser(req, res, next) {
  try {
    const { phone, password } = req.body;
    console.log(phone, password);
    // Xác thực user
    const user = await usersService.authenticateUser(phone, password);
    console.log(user);
    if (!user) {
      // Sai thông tin đăng nhập
      return next(new ApiError(401, 'Phone or password is incorrect'));
    }
    if (!process.env.SECRET_KEY_USER) {
      return next(new ApiError(500, 'Secret key not defined'));
    }
    // Tạo token JWT
    const token = jwt.sign(
      { user_id: user.user_id,
        phone: user.phone },
      process.env.SECRET_KEY_USER,
      { expiresIn: '1h' }
    );
    // Phản hồi thành công với token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, 'An error occurred while logging in')); 
  }
}
async function updateUser(req, res, next) {
    return res.json(JSend.success({ token: 'token' }));
}
async function getUserById(req, res, next) {
    return res.json(JSend.success({ token: 'token' }));    
}
async function logout(params) {
    return res.json(JSend.success({ token: 'token' }));
}
module.exports = {
    registerUser,
    loginUser,
    updateUser,
    getUserById,
    logout
}