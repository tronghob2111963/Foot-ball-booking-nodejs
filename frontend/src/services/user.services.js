import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/users';

// Hàm đăng ký người dùng
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data; // Trả về dữ liệu người dùng đăng ký thành công
  } catch (error) {
    throw new Error('Failed to register user: ' + error.message);
  }
};

// Hàm đăng nhập người dùng
const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    return response.data; // Trả về dữ liệu người dùng đăng nhập thành công
  } catch (error) {
    throw new Error('Failed to log in: ' + error.message);
  }
};

export default {
  registerUser,
  loginUser
};
