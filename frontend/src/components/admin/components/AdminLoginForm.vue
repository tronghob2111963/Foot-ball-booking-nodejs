<template>
  <div class="container mt-5">
    <h2>Admin Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label
          for="admin_name"
          class="form-label"
          >Admin Name</label
        >
        <input
          type="text"
          class="form-control"
          id="admin_name"
          v-model="loginData.name"
          required
        />
      </div>

      <div class="mb-3">
        <label
          for="admin_password"
          class="form-label"
          >Password</label
        >
        <input
          type="password"
          class="form-control"
          id="admin_password"
          v-model="loginData.password"
          required
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginData: {
        name: '',
        password: ''
      }
    };
  },
  methods: {
    login() {
      // Kiểm tra thông tin đăng nhập
      if (this.loginData.name === 'admin' && this.loginData.password === 'admin123') {
        this.$router.push({ name: 'fieldManagement' }); // Chuyển đến trang quản lý sân
      } else {
        alert('Invalid admin credentials');
      }
    }
  }
};
</script>

<style scoped>
/* Style cho trang đăng nhập */
</style>
