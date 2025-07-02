import axios from 'axios';

const API_URL = 'api/v1/user/'; // Fixed API URL to include the slash

// Hàm gửi dữ liệu đặt chỗ lên server
const createReservation = async (reservationData, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}` // Gửi token trong header
    };

    const response = await axios.post(`${API_URL}reservations`, reservationData, { headers });

    // Nếu server trả về token mới, lưu lại token
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
    }

    return response.data; // Trả về kết quả từ server
  } catch (error) {
    console.error('Lỗi khi tạo đặt chỗ:', error);
    throw error; // Truyền lỗi để xử lý ở component
  }
};

export default {
  createReservation
};
