<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginAdmin } from '@/services/admin.services';
import { Form, Field, ErrorMessage, defineRule } from 'vee-validate';

const name = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');

const router = useRouter();

const login = async () => {
  try {
    const response = await loginAdmin({ name: name.value, password: password.value });
    if (response.token) {
      localStorage.setItem('isAdminLoggedIn', true); // Đánh dấu là admin đã đăng nhập
      localStorage.setItem('adminToken', response.token); // Nếu cần, lưu token
      alert('Login successful');
      router.push('/field-management');
    } else {
      errorMessage.value = 'Invalid login response';
    }
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.';
  }
};
</script>

<template>
  <div class="login-container">
    <h2 class="mb-4 form-title">Admin Login</h2>

    <div id="login-form">
      <Form @submit="login">
        <div class="mb-3">
          <label
            for="name"
            class="form-label"
            >Name</label
          >
          <Field
            name="name"
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Enter name"
          />
          <ErrorMessage
            name="name"
            class="error-feedback"
          />
        </div>

        <div class="mb-3 position-relative">
          <label
            for="password"
            class="form-label"
            >Password</label
          >
          <div class="input-with-icon">
            <Field
              name="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Enter password"
            />
            <button
              type="button"
              class="show-password-btn"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <ErrorMessage
            name="password"
            class="error-feedback"
          />
        </div>

        <div class="register-link-container">
          <router-link
            to="/register-admin"
            class="register-link"
            >Register here!</router-link
          >
        </div>

        <div class="button-container">
          <button
            type="submit"
            class="btn btn-primary"
          >
            Login
          </button>
        </div>

        <p
          v-if="errorMessage"
          class="error-feedback"
        >
          {{ errorMessage }}
        </p>
      </Form>
    </div>
  </div>
</template>

<style scoped>
/* Giữ nguyên phần style của bạn */
.login-container {
  max-width: 400px;
  margin: 15px auto;
  padding: 2rem;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
.form-label {
  font-weight: 500;
}
.form-control {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ced4da;
  font-size: 1rem;
}
.input-with-icon {
  position: relative;
}
.show-password-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
.show-password-btn:hover {
  opacity: 1;
  text-decoration: underline;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.btn {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 1rem;
}
.error-feedback {
  color: #e63946;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
}
.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2d2d2d;
}
.register-link-container {
  font-size: 14px;
  text-align: right;
  margin-top: 1rem;
}
.register-link {
  color: #007bff;
  text-decoration: none;
}
.register-link:hover {
  text-decoration: underline;
  color: red;
}
</style>
