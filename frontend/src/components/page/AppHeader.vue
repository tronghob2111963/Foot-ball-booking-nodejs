<template>
  <nav
    class="navbar navbar-expand bg-dark"
    data-bs-theme="dark"
  >
    <div class="container-fluid d-flex justify-content-between">
      <!-- Left Section: GoFutField, Items, Field Management -->
      <div class="d-flex left w-75 justify-content-start">
        <!-- Chuyển Field Management lên trước GoFutField -->
        <router-link
          to="/field-management"
          class="navbar-brand"
          >Field Management</router-link
        >
        <router-link
          to="/items-list"
          class="navbar-brand"
          >Items</router-link
        >
        <router-link
          to="/"
          class="navbar-brand"
          >GoFutField</router-link
        >
      </div>

      <!-- Right Section: YourCart, Login, Logout -->
      <div class="d-flex right align-items-center w-25 justify-content-end ms-3">
        <div class="me-2">
          <!-- YourCart -->
          <router-link
            to="/user-store"
            class="nav-link p-0"
          >
            <button
              class="btn btn-outline-dark"
              type="button"
            >
              <i class="fa-solid fa-cart-shopping"></i> YourCart
            </button>
          </router-link>
        </div>
        <div class="me-2">
          <!-- Login -->
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="loginDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Login
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="loginDropdown"
            >
              <li>
                <router-link
                  to="/login-user#login"
                  class="dropdown-item"
                  >Login with User</router-link
                >
              </li>
              <li>
                <router-link
                  to="/login-admin#login"
                  class="dropdown-item"
                  >Login with Admin</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div>
          <!-- Logout -->
          <button
            class="btn btn-secondary"
            @click="confirmLogout"
          >
            <i class="fas fa-sign-out"></i> Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const role = ref(localStorage.getItem('userRole')); // 'admin' hoặc 'user'

const confirmLogout = () => {
  if (role.value === 'admin') {
    const isConfirmed = confirm('You are logged in as Admin. Are you sure you want to logout?');
    if (isConfirmed) {
      logout();
    }
  } else if (role.value === 'user') {
    const isConfirmed = confirm('You are logged in as User. Are you sure you want to logout?');
    if (isConfirmed) {
      logout();
    }
  } else {
    alert('User is not logged in.');
  }
};

const logout = () => {
  localStorage.removeItem('userRole');
  router.push('/');
};
</script>

<style scoped>
nav {
  border-radius: 1rem;
  background: linear-gradient(135deg, #2d8b48, #ff5722);
}

.navbar-brand {
  font-size: 1.2rem;
  margin-right: 15px; /* Add spacing between items */
}

.container-fluid {
  display: flex;
  justify-content: space-between;
}

.left {
  display: flex;
  justify-content: flex-start;
  width: 75%;
  gap: 20%;
  padding-right: 20px;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 25%;
}

.ms-3 {
  margin-left: 15px; /* Gap between left and right sections */
}

.me-2 {
  margin-right: 5px; /* Gap between YourCart, Login, and Logout */
}

.navbar .btn-outline-dark {
  color: #fff;
  border-color: #fff;
}

.navbar .btn-outline-dark:hover {
  background-color: #ff5722;
  border-color: #ff5722;
}

.navbar .btn-secondary {
  background-color: #6c757d;
  color: white;
  border-radius: 5px;
  padding: 0.5rem 1rem;
}

.navbar .btn-secondary:hover {
  background-color: #ff5722;
}

.navbar i {
  margin-right: 5px;
}
.left .navbar-brand:hover {
  background-color: #1e7d34; /* Màu nền cho phần tử bên trái khi hover */
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
}

.right .btn:hover {
  background-color: #ffc107; /* Màu nền cho các nút bên phải khi hover */
  color: #000;
  border-radius: 0.5rem;
}
</style>
