import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/admin';

export const loginAdmin = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
};

// Register Admin
export const registerAdmin = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Registration failed. Please try again.');
  }
};
