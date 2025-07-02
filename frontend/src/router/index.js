import { createRouter, createWebHistory } from 'vue-router';
import LoginUser from '@/components/user/views/LoginUser.vue';
import LoginAsAdmin from '@/components/admin/views/LoginAsAdmin.vue';
import GoFutFields from '@/components/views/GoFutFields.vue';
import FieldForm from '@/components/utils/Fields/FieldForm.vue';
import GoFutItems from '@/components/views/GoFutItems.vue';
import ItemDetails from '@/components/utils/Items/ItemDetails.vue';
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
  {
    path: '/',
    name: 'GoFutField',
    component: GoFutFields
  },
  {
    path: '/items-list',
    name: 'items-list',
    component: GoFutItems
  },
  {
    path: '/login-user',
    name: 'login-user',
    component: LoginUser
  },
  {
    path: '/register-user',
    name: 'registeruser',
    component: () => import('@/components/user/views/RegisterUser.vue') // Lazy Load
  },
  {
    path: '/login-admin',
    name: 'login-admin',
    component: LoginAsAdmin
  },
  {
    path: '/register-admin',
    name: 'registeradmin',
    component: () => import('@/components/admin/views/RegisterAdmin.vue')
  },
  /*{
    path: '/field-management/edit-field/:field_id', // Dynamic route
    name: 'editfield',
    component: () => import('@/components/admin/views/EditField.vue'),
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('isAdminLoggedIn')) {
        next({ name: 'login-admin' });
      } else {
        next();
      }
    }
  },*/
  {
    path: '/items/:id',
    name: 'ItemDetails',
    component: ItemDetails
  },
  {
    // Route động cho FieldForm với field_id
    path: '/fields/:field_id', // Dynamic route
    name: 'fieldform',
    component: FieldForm,
    props: true, // Chuyển `field_id` vào dưới dạng prop
    beforeEnter: (to, from, next) => {
      // Kiểm tra nếu không có thông tin đăng nhập admin trong localStorage
      if (!localStorage.getItem('isUserLogined')) {
        next({ name: 'login-user' });
      } else {
        next();
      }
    }
  },
  {
    path: '/field-management',
    name: 'fieldmanagement',
    component: () => import('@/components/admin/views/AdminDashboard.vue'),
    meta: { requiresAuth: true }, // Thêm meta để chỉ định cần đăng nhập
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('isAdminLoggedIn')) {
        next({ name: 'login-admin' });
      } else {
        next();
      }
    }
  },
  {
    path: '/field-management/add-field',
    name: 'addfield',
    component: () => import('@/components/admin/components/AddField.vue'),
    meta: { requiresAuth: true }, // Thêm meta để chỉ định cần đăng nhập
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('isAdminLoggedIn')) {
        next({ name: 'login-admin' });
      } else {
        next();
      }
    }
  },
  {
    path: '/field-management/delete-fields',
    name: 'deleteallfield',
    component: () => import('@/components/admin/components/DeleteField.vue'),
    meta: { requiresAuth: true }, // Thêm meta để chỉ định cần đăng nhập
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('isAdminLoggedIn')) {
        next({ name: 'login-admin' });
      } else {
        next();
      }
    }
  },
  {
    path: '/field-management/delete-items',
    name: 'deleteAllItems',
    component: () => import('@/components/admin/components/DeleteItem.vue'),
    meta: { requiresAuth: true } // Thêm meta để chỉ đăng nhập
  },
  {
    path: '/field-management/add-items',
    name: 'additems',
    component: () => import('@/components/admin/components/AddItems.vue'),
    meta: { requiresAuth: true } // Thêm meta để chỉ đ��nh cần đăng nhập
  },

  {
    path: '/user-store',
    name: 'userstore',
    component: () => import('@/components/user/views/UserStore.vue'),
    meta: { requiresAuth: true }, // Thêm meta để chỉ định cần đăng nhập
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('isUserLogined')) {
        next({ name: 'login-user' });
      } else {
        next();
      }
    }
  },
  {
    path: '/user-resverations',
    name: 'UserStore',
    component: () => import('@/components/user/components/Reservation.vue')
  },
  {
    path: '/:pathMatch(.*)', // Cần phải đặt route này ở cuối
    name: 'notfound',
    component: () => import('@/components/error/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Đảm bảo sử dụng `createWebHistory` ở đây
  routes
});

// Hook afterEach để cuộn đến phần tử có hash trong URL
router.afterEach((to) => {
  if (to.hash) {
    const element = document.getElementById(to.hash.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    if (!localStorage.getItem('isAdminLoggedIn')) {
      next({ name: 'login-admin' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
