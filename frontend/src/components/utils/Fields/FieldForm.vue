<template>
  <div
    v-if="field"
    class="field-details"
  >
    <div class="field-image-container">
      <img
        :src="field.image_url || DEFAULT_AVATAR"
        alt="Field Image"
        class="field-image"
      />
    </div>

    <div class="field-info">
      <h2>Field Details</h2>
      <p><strong>ID:</strong> {{ field.field_id }}</p>
      <p><strong>Name:</strong> {{ field.field_name }}</p>
      <p><strong>Type:</strong> {{ field.type_fields }}</p>
      <p><strong>Price:</strong> ${{ field.price_per_hour }}/hr</p>
      <p><strong>Status:</strong> {{ field.status }}</p>

      <div class="hire-button-container">
        <button class="hire-button">Hire</button>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Loading...</p>
    <!-- Hiển thị thông báo khi chưa có dữ liệu -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FieldService from '@/services/fields.services.js'; // Đảm bảo đã import service để fetch dữ liệu
import { DEFAULT_AVATAR } from '@/constants.js'; // Import constant cho avatar mặc định

const route = useRoute(); // Lấy route hiện tại
const field = ref(null); // Khởi tạo ref cho field

// Hàm fetch dữ liệu chi tiết của field từ API
const fetchFieldDetails = async (fieldId) => {
  try {
    const response = await FieldService.fetchFieldById(fieldId); // Gọi API để lấy dữ liệu field
    field.value = response.data.fields; // Gán dữ liệu vào field nếu dữ liệu trả về hợp lệ
  } catch (error) {
    console.error('Error fetching field details:', error); // Log lỗi nếu có
  }
};

onMounted(() => {
  const { field_id } = route.params; // Lấy field_id từ route params
  fetchFieldDetails(field_id); // Fetch dữ liệu chi tiết của field
});
</script>

<style scoped>
.field-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.field-image-container {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.field-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.field-info {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.hire-button-container {
  margin-top: 20px;
}

.hire-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.hire-button:hover {
  background-color: #45a049;
}
</style>
