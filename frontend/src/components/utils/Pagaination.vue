<script>
import { ref, onMounted, onUnmounted } from 'vue';
import ListField from './Fields/FieldsList.vue';
import ListItems from './Items/ItemsList.vue';

export default {
  components: {
    ListField,
    ListItems
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const loading = ref(false);

    // Scroll event handler to detect when user reaches the bottom
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // Load more fields when near the bottom
      if (scrollPosition + 200 >= pageHeight && !loading.value) {
        emit('loadMore');
      }
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      loading
    };
  }
};
</script>
<template>
  <div>
    <ListField :Fields="fields" />
    <div
      v-if="loading"
      class="loading"
    >
      Loading...
    </div>
    <ListItems :Items="items" />
    <div
      v-if="loading"
      class="loading"
    >
      Loading...
    </div>
  </div>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
  color: #aaa;
}
</style>
