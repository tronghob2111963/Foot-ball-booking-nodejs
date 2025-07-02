<template>
  <div class="container mt-3">
    <div class="welcome-container">
      <h1 class="welcome-title">Welcome to Our Football Website!</h1>
      <p class="welcome-text">Join us to explore the latest football news, matches, and more!</p>
      <p class="welcome-text">A place to satisfy your football passion</p>
    </div>
  </div>
</template>
<script>
window.onload = function () {
  const welcomeTitle = document.querySelector('.welcome-title');
  welcomeTitle.style.opacity = 1;
  welcomeTitle.style.transition = 'opacity 1.5s ease-in-out';
};
</script>
<style>
.container {
  max-width: 87rem;
}
.welcome-container {
  background: linear-gradient(135deg, #000000, #2d8b48);
  background-size: cover;
  background-position: center;
  max-width: auto;
  padding: 100px 20px;
  color: white;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  transform: scale(1.07);
  transition: box-shadow 0.3s ease;
  border: 3px solid grey;
  margin-bottom: 1rem;
}
.welcome-title {
  font-size: 48px;
  font-weight: bold;
  animation: fadeIn 2s ease-in-out;
}
.welcome-text {
  font-size: 20px;
  margin-top: 20px;
  animation: slideIn 1.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideIn {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
