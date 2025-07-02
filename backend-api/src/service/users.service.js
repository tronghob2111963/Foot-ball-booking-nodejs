/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const knex = require('../database/knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;


function userRepository() {
    return knex('users');
}
function readUser(payload){
    return{
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        image_url: payload.image_url
    }

}
async function checkUserPhoneExists(phone) {
     const row = await userRepository().where('phone', phone).first();
    return !!row;
}
async function registerService (payload) {
    try {
        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
        
        const user = {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            phone: payload.phone,
            image_url: payload.image_url || '/public/img_admin/default.jpg'
        }

        // Lưu user vào cơ sở dữ liệu và lấy ID mới
        const [user_id] = await userRepository().insert(user)

        // Trả về thông tin user đã lưu (bao gồm cả user_id)
        return { user_id, ...user };
    } catch (error) {
        console.error(error);
        throw new Error('Registration failed');
    }
}
async function authenticateUser(phone, password) {
    try {
         // Sử dụng Knex để truy vấn admin theo tên
        const user = await userRepository().where('phone', phone).first();
       

        if (!user) {
            return next (new ApiError(404, 'User not found'));
        }

        if (phone) {
            // Kiểm tra mật khẩu
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return user;
            }
        }
        return null; 
    } catch (error) {
        console.error(error);
        throw new Error('Registration failed');
        
    }
}
module.exports = {
    registerService,
    checkUserPhoneExists,
    authenticateUser
};