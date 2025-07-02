/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const knex = require('../database/knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

function adminRepository() {
    return knex('admin');
}

// function readAdmin(payload) {
//     return {
//         name: payload.name,
//         password: payload.password,
//         image_url: payload.image_url
//     };
// }

async function checkAdminNameExists(name) {
    const row = await adminRepository().where('name', name).first();
    return !!row;
}

async function register(payload) {
    try {
        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
        
        // Chuyển dữ liệu cần lưu vào cơ sở dữ liệu
        const admin = {
            name: payload.name,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
            image_url: payload.image_url || '/public/img_admin/default.jpg' // Hình ảnh mặc định nếu không có
        };

        // Lưu admin vào cơ sở dữ liệu và lấy ID mới
        const [admin_id] = await adminRepository().insert(admin);

        // Trả về thông tin admin đã lưu (bao gồm cả admin_id)
        return { admin_id, ...admin };
    } catch (error) {
        console.error(error);
        throw new Error('Registration failed');
    }
}

async function authenticate(name, password) {
    try {
        // Sử dụng Knex để truy vấn admin theo tên
        const admin = await adminRepository().where('name', name).first();
       

        if (admin) {
            // Kiểm tra mật khẩu
            const match = await bcrypt.compare(password, admin.password);
            if (match) {
                return admin;
            }
        }
        return null; // Không tìm thấy admin hoặc mật khẩu không khớp
    } catch (error) {
        console.error(error);
        throw new Error('Authentication failed');
    }
}

module.exports = {
    register,
    checkAdminNameExists,
    authenticate
};
