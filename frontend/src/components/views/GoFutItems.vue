<template>
  <div class="items-container">
    <div
      class="item"
      v-for="(item, index) in items"
      :key="index"
      @click="goToFieldDetail(item.item_name)"
    >
      <img
        :src="item.image_url || DEFAULT_AVATAR"
        alt="Item Avatar"
        class="item-image"
      />
      <h3>{{ item.item_name }}</h3>
      <p>Price: ${{ item.price }}</p>
      <p>Stock: {{ item.stock }}</p>
    </div>
    <div
      v-if="loading"
      class="loading"
    >
      Loading more...
    </div>
    <div v-if="items.length === 0 && !loading">No items found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ItemsService from '@/services/items.services.js';
import { DEFAULT_AVATAR } from '@/constants.js';

const currentPage = ref(1);
const items = ref([]);
const loading = ref(false);
const router = useRouter();

const fetchItems = async (page = 1, limit = 6) => {
  try {
    loading.value = true;
    const response = await ItemsService.fetchAllItems(page, limit);
    if (response) {
      items.value = [...items.value, ...response]; // Gộp mảng trả về vào danh sách
    }
  } catch (error) {
    console.error('Error fetching items:', error);
  } finally {
    loading.value = false;
  }
};

const goToFieldDetail = (itemName) => {
  router.push({ name: 'ItemDetails', params: { id: itemName } });
};

const handleScroll = () => {
  const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
  if (bottom && !loading.value) {
    currentPage.value++;
    fetchItems(currentPage.value);
  }
};

onMounted(() => {
  fetchItems();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.items-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

.item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.item:hover {
  transform: scale(1.05);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.loading {
  grid-column: span 6;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
}
</style>
