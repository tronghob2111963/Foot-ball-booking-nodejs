// Import các thư viện cần thiết
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createApp } from 'vue';
import App from './App.vue';
import store from '@/services/store';
import router from './router/index';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app');
