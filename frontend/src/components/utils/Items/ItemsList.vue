<template>
  <div>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
      >
        <router-link :to="{ name: 'ItemDetails', params: { id: item.id } }">
          <img
            :src="item.image_url || DEFAULT_AVATAR"
            alt="Item Avatar"
            class="items-image"
          />
          {{ item.item_name }} - ${{ item.price }} - Stock: {{ item.stock }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { DEFAULT_AVATAR } from '@/constants.js';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.items-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
