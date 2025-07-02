<template>
  <div class="not-found">
    <h4>Oops! Page not found.</h4>
    <p>Sorry, the page you're looking for doesn't exist.</p>
    <router-link
      :to="{ name: 'GoFutField' }"
      class="btn btn-primary"
      >Go to Home</router-link
    >
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
.not-found h4 {
  font-size: 24px;
  color: #333;
}
.not-found p {
  margin: 20px 0;
  font-size: 18px;
  color: #555;
}
.not-found .btn {
  margin-top: 20px;
}
</style>
