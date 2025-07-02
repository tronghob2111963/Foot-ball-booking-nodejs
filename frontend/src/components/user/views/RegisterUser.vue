<template>
  <div class="register-container">
    <div class="register-title">
      <h2 class="mb-4">User Register</h2>
    </div>
    <Form
      :validation-schema="validationSchema"
      @submit="submitRegister"
    >
      <!-- Name Field -->
      <div class="mb-3">
        <label
          for="name"
          class="form-label"
          >Name</label
        >
        <Field
          name="name"
          type="text"
          class="form-control"
          placeholder="Enter your name"
        />
        <ErrorMessage
          name="name"
          class="error-feedback"
        />
      </div>

      <!-- Phone Number Field -->
      <div class="mb-3">
        <label
          for="phone"
          class="form-label"
          >Phone Number</label
        >
        <Field
          name="phone"
          type="tel"
          class="form-control"
          placeholder="Enter phone number"
        />
        <ErrorMessage
          name="phone"
          class="error-feedback"
        />
      </div>

      <!-- Password Field -->
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

      <!-- Confirm Password Field -->
      <div class="mb-3">
        <label
          for="confirmPassword"
          class="form-label"
          >Confirm Password</label
        >
        <Field
          name="confirmPassword"
          type="password"
          class="form-control"
          placeholder="Confirm password"
        />
        <ErrorMessage
          name="confirmPassword"
          class="error-feedback"
        />
      </div>

      <!-- Email Field -->
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
          >E-mail</label
        >
        <Field
          name="email"
          type="email"
          class="form-control"
          placeholder="Enter email"
        />
        <ErrorMessage
          name="email"
          class="error-feedback"
        />
      </div>

      <!-- Avatar Upload Field -->
      <div class="mb-3">
        <label
          for="avatar"
          class="form-label"
          >Avatar</label
        >
        <input
          type="file"
          id="avatar"
          name="avatar"
          class="form-control"
          accept="image/*"
          @change="handleFileChange"
        />
        <ErrorMessage
          name="avatar"
          class="error-feedback"
        />
      </div>

      <div class="button-container">
        <button
          :disabled="loading"
          type="submit"
          class="btn btn-success"
        >
          {{ loading ? 'Registering...' : 'Register' }}
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
    name: z.string().min(8).max(255),
    email: z.string().email().max(255),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/),
    confirmPassword: z
      .string()
      .min(8)
      .superRefine((val, ctx) => {
        if (ctx.parent?.password && val !== ctx.parent.password) {
          ctx.addIssue({ path: ['confirmPassword'], message: 'Passwords do not match.' });
        }
      }),
    phone: z
      .string()
      .regex(/^[0-9]{9,20}$/)
      .optional(),
    avatar: z.instanceof(File).optional()
  })
);

const router = useRouter();
const loading = ref(false);
const avatar = ref(null);

function handleFileChange(event) {
  const file = event.target.files[0];
  avatar.value = file;
}

async function submitRegister(values) {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);
    formData.append('phone', values.phone);
    if (avatar.value) {
      formData.append('avatar', avatar.value);
    }

    const response = await userServices.registerUser(formData);
    console.log('Registration successful:', response);
    alert('Registration successful! Please log in.');
    router.push({ name: 'login-user' });
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
  margin-top: 1rem;
}
.register-title {
  text-align: center;
}
.position-relative {
  position: relative;
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
  opacity: 0.25;
}
.show-password-btn i {
  font-size: 18px;
}
.info-icon {
  margin-left: 5px;
  cursor: pointer;
}
.password-rules {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
}
.avatar-preview {
  margin-top: 1rem;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
