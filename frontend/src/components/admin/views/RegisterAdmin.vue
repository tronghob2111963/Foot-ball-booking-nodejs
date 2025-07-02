<template>
  <div class="register-container">
    <div class="register-title">
      <h2 class="mb-4">Admin Register</h2>
    </div>
    <Form @submit="register">
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
            rules="strongPassword"
          />
          <button
            type="button"
            class="show-password-btn"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
          <!-- Info Icon for Password Requirements -->
          <button
            type="button"
            class="password-info-btn"
            @mouseover="showPasswordRequirements = true"
            @mouseleave="showPasswordRequirements = false"
          >
            <i class="fas fa-info-circle"></i>
          </button>
        </div>
        <ErrorMessage
          name="password"
          class="error-feedback"
        />
        <!-- Password Requirements Section -->
        <div
          v-show="showPasswordRequirements && password"
          class="password-requirements"
        >
          <p>Password must include:</p>
          <ul>
            <li :class="password.match(/[A-Z]/) ? 'valid' : 'invalid'">
              At least one uppercase letter
            </li>
            <li :class="password.match(/\d/) ? 'valid' : 'invalid'">At least one number</li>
            <li :class="password.match(/[!@#$%^&*]/) ? 'valid' : 'invalid'">
              At least one special character
            </li>
            <li :class="password.length >= 8 ? 'valid' : 'invalid'">Minimum 8 characters</li>
          </ul>
        </div>
      </div>

      <div class="mb-3 position-relative">
        <label
          for="confirmPassword"
          class="form-label"
          >Confirm Password</label
        >
        <div class="input-with-icon">
          <Field
            name="confirmPassword"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="form-control"
            placeholder="Confirm password"
            @paste.prevent
            :rules="(value) => value === password || 'Passwords do not match'"
          />
          <button
            type="button"
            class="show-password-btn"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <ErrorMessage
          name="confirmPassword"
          class="error-feedback"
        />
      </div>

      <div class="mb-3">
        <label
          for="image"
          class="form-label"
          >Profile Image</label
        >
        <input
          type="file"
          class="form-control"
          @change="onFileChange"
        />
        <div
          v-if="imagePreview"
          class="image-preview"
        >
          <img
            :src="imagePreview"
            alt="Image Preview"
          />
        </div>
      </div>

      <div class="button-container">
        <button
          type="submit"
          class="btn btn-success"
        >
          Register
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
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage, defineRule } from 'vee-validate';
import { registerAdmin } from '@/services/admin.services';

// Define a custom validation rule for password
defineRule('strongPassword', (value) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!regex.test(value)) {
    return 'Password must contain at least one uppercase letter, one number, and one special character.';
  }
  return true;
});

export default {
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    const name = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const imageFile = ref(null);
    const imagePreview = ref(null);
    const errorMessage = ref('');
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const showPasswordRequirements = ref(false); // Track whether the requirements are shown
    const router = useRouter();

    const register = async () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        return;
      }
      try {
        const formData = new FormData();
        formData.append('name', name.value);
        formData.append('password', password.value);
        if (imageFile.value) {
          formData.append('image_urlFile', imageFile.value);
        }
        await registerAdmin(formData);
        alert('Registration successful');
        router.push('/login-admin');
      } catch (error) {
        errorMessage.value = 'Registration failed. Please try again.';
      }
    };

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        imageFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.value = null;
      }
    };

    return {
      name,
      password,
      confirmPassword,
      imageFile,
      imagePreview,
      errorMessage,
      showPassword,
      showConfirmPassword,
      showPasswordRequirements,
      register,
      onFileChange
    };
  }
};
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
  opacity: 0.5;
}
.show-password-btn:hover {
  opacity: 1;
}
.password-info-btn {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
}
.password-info-btn:hover {
  opacity: 1;
}
.error-feedback {
  color: #e63946;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.register-title {
  text-align: center;
}
.image-preview {
  margin-top: 1rem;
  text-align: center;
}
.image-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.password-requirements {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6c757d;
}
.password-requirements ul {
  list-style-type: none;
  padding: 0;
}
.password-requirements li {
  margin-bottom: 5px;
}
.password-requirements li.valid {
  color: #28a745;
}
.password-requirements li.invalid {
  color: #e63946;
}
</style>
