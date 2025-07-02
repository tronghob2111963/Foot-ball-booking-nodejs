<template>
  <div class="login-container">
    <h2 class="mb-4 form-title">User Login</h2>
    <Form
      :validation-schema="validationSchema"
      @submit="submitLogin"
    >
      <div class="mb-3">
        <label
          for="phone"
          class="form-label"
          >Phone Number</label
        >
        <Field
          name="phone"
          type="text"
          class="form-control"
          placeholder="Enter phone number"
        />
        <ErrorMessage
          name="phone"
          class="error-feedback"
        />
      </div>

      <div class="mb-3 position-relative">
        <label
          for="password"
          class="form-label"
          >Password</label
        >
        <Field
          name="password"
          type="password"
          class="form-control"
          placeholder="Enter password"
        />
        <ErrorMessage
          name="password"
          class="error-feedback"
        />
      </div>

      <div class="register-link-container">
        <router-link
          to="/register-user"
          class="register-link"
        >
          Don’t have an account? Register here!
        </router-link>
      </div>

      <div class="button-container">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Login
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import userServices from '@/services/user.services';

const validationSchema = toTypedSchema(
  z.object({
    phone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits.' }),
    password: z.string().min(8)
  })
);

const router = useRouter();
const loading = ref(false);

async function submitLogin(values) {
  loading.value = true;
  try {
    const response = await userServices.loginUser(values);
    console.log('Login successful:', response);
    localStorage.setItem('isUserLoggedIn', true);
    localStorage.setItem('userToken', response.token);
    // Redirect to the dashboard after login
    router.push({ name: 'UserStore' }); // Redirect to the dashboard after login
  } catch (error) {
    console.error('Login error:', error);
    alert('Invalid credentials or login failed.');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
.form-label {
  font-weight: 500;
}
.error-feedback {
  color: #d9534f;
  font-size: 0.875rem;
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
.form-title {
  text-align: center;
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
</style>
