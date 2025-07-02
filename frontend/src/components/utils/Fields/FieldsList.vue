<template>
  <ul>
    <li
      v-for="(field, index) in Fields"
      :key="index"
    >
      <img
        :src="field.image_url || DEFAULT_AVATAR"
        alt="Field Avatar"
        class="field-image"
      />
      {{ field.field_name }} - {{ field.type_fields }} - ${{ field.price_per_hour }}
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from 'vue';
import { DEFAULT_AVATAR } from '@/constants.js';

const props = defineProps({
  Fields: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.field-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
