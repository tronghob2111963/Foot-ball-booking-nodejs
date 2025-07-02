<template>
  <footer class="footer bg-dark text-white py-3">
    <div class="container text-center">
      <div class="row">
        <div class="col-md-4">
          <h5>About Us</h5>
          <p>We are dedicated to providing top-notch services and products for our users.</p>
        </div>
        <div class="col-md-4">
          <h5>Social Links</h5>
          <ul class="list-unstyled">
            <li>
              <a
                href="https://www.facebook.com/YourPage"
                target="_blank"
                class="text-white"
              >
                <i class="fab fa-facebook-f"></i> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/YourChannel"
                target="_blank"
                class="text-white"
              >
                <i class="fab fa-youtube"></i> YouTube
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/YourProfile"
                target="_blank"
                class="text-white"
              >
                <i class="fab fa-twitter"></i> Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/YourProfile"
                target="_blank"
                class="text-white"
              >
                <i class="fab fa-instagram"></i> Instagram
              </a>
            </li>
          </ul>
        </div>
        <div class="col-md-4">
          <h5>Contact</h5>
          <p>Email: info@example.com</p>
          <p>Phone: +123 456 789</p>
        </div>
      </div>
      <hr class="bg-light" />
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
};
</script>

<style scoped>
footer {
  width: 85rem;
  border: 3px solid black;
  border-radius: 0;
  margin: 10px 5px 15px;
  padding: 20px 0;
  border-radius: 1rem;
}

footer a:hover {
  text-decoration: underline;
}

footer i {
  margin-right: 8px;
}

.container {
  width: 100%;
}

ul {
  padding-left: 0;
}

ul li {
  list-style-type: none;
  margin: 10px 0;
}
</style>
