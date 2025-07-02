<template>
  <div class="container mt-5">
    <h2>Edit Field</h2>
    <form @submit.prevent="submitEditForm">
      <button
        type="submit"
        class="btn btn-primary"
      >
        Save Changes
      </button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    submitEditForm() {
      console.log('Field Edited');
      // Logic gửi dữ liệu sửa sân
    }
  }
};
</script>

<style scoped>
/* Style cho form sửa sân */
</style>
