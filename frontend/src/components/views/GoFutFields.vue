<template>
  <div class="fields-container">
    <div
      class="field-item"
      v-for="(field, index) in fields"
      :key="field.field_id"
      @click="goToFieldDetail(field.field_id)"
    >
      <img
        :src="field.image_url || DEFAULT_AVATAR"
        alt="Field Avatar"
        class="field-image"
      />
      <h3>{{ field.field_name }}</h3>
      <p>ID: {{ field.field_id }}</p>
      <p>Type: {{ field.type_fields }}</p>
      <p>Price: ${{ field.price_per_hour }}/hr</p>
      <p>Status: {{ field.status }}</p>
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      Loading more...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import FieldService from '@/services/fields.services.js';
import { DEFAULT_AVATAR } from '@/constants.js';

const router = useRouter();
const fields = ref([]);
const loading = ref(false);
let currentPage = 1;
const totalPages = ref(10);

const fetchFields = async (page = 1, limit = 9) => {
  try {
    loading.value = true;
    const response = await FieldService.fetchFields(page, limit);
    fields.value = [...fields.value, ...response.data.fields];
  } catch (error) {
    console.error('Error fetching fields:', error);
  } finally {
    loading.value = false;
  }
};

const goToFieldDetail = (fieldId) => {
  router.push({ name: 'fieldform', params: { field_id: fieldId } });
};

const handleScroll = () => {
  const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
  if (bottom && !loading.value && currentPage < totalPages.value) {
    currentPage++;
    fetchFields(currentPage);
  }
};

onMounted(() => {
  fetchFields(currentPage);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.fields-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}
.field-item {
  border: 1px solid black;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.field-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.field-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
}

.field-detail {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
}
</style>
