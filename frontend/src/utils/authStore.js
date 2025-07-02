import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useStorage('auth_token', null), // Lưu token vào localStorage
    role: useStorage('auth_role', 'guest') // Lưu role vào localStorage
  }),
  actions: {
    /**
     * Cập nhật vai trò người dùng và token
     * @param {string} role Vai trò của người dùng ('admin' hoặc 'user')
     * @param {string} token Token xác thực
     */
    setUser(role, token) {
      this.role = role;
      this.token = token;
    },

    /**
     * Xóa thông tin người dùng và token khỏi store
     */
    logout() {
      this.token = null;
      this.role = 'guest'; // Reset về vai trò mặc định
    }
  },
  getters: {
    /**
     * Kiểm tra xem người dùng có phải là admin không
     */
    isAdmin() {
      return this.role === 'admin';
    },

    /**
     * Kiểm tra xem người dùng đã đăng nhập chưa
     */
    isAuthenticated() {
      return !!this.token && this.role !== 'guest';
    }
  }
});
