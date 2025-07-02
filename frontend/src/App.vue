<script setup>
import AppHeader from '@/components/page/AppHeader.vue';
import AppFooter from '@/components/page/AppFooter.vue';
import Welcome from '@/components/views/Welcome.vue';
</script>

<template>
  <div>
    <Welcome />
    <AppHeader />
    <div class="container mt-3">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<style>
body {
  margin-bottom: 10px;
  background-color: whitesmoke;
}
</style>
