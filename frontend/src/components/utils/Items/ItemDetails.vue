<template>
  <div
    v-if="item"
    class="item-details"
  >
    <div class="item-image-container">
      <img
        :src="item.image_url || DEFAULT_AVATAR"
        alt="Item Image"
        class="item-image"
      />
    </div>
    <div class="item-info">
      <h2>Item Details</h2>
      <p><strong>Name:</strong> {{ item.item_name }}</p>
      <p><strong>Price:</strong> ${{ item.price }}</p>
      <p><strong>Stock:</strong> {{ item.stock }}</p>
      <div class="hire-button-container">
        <button class="hire-button">Hire</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ItemsService from '@/services/items.services.js';
import { DEFAULT_AVATAR } from '@/constants.js';

const route = useRoute(); // Lấy route hiện tại
const item = ref(null); // Dữ liệu chi tiết của item

// Hàm fetch dữ liệu chi tiết của item
const fetchItemDetails = async (itemId) => {
  try {
    const response = await ItemsService.fetchItemDetails(itemId);
    if (response && response.data) {
      item.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching item details:', error);
  }
};

onMounted(() => {
  const { id } = route.params; // Lấy id từ route params
  fetchItemDetails(id); // Fetch dữ liệu chi tiết
});
</script>

<style scoped>
.item-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.item-image-container {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.item-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.item-info {
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
