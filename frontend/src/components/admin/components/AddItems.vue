<template>
  <div class="container mt-5">
    <h2 class="title">Add New Item</h2>
    <form @submit.prevent="submitItemForm">
      <div class="form-group">
        <label for="item_name">Item Name</label>
        <input
          type="text"
          id="item_name"
          v-model="itemData.item_name"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="price">Price</label>
        <input
          type="number"
          id="price"
          v-model="itemData.price"
          class="form-control"
          required
          min="0"
        />
      </div>

      <div class="form-group">
        <label for="stock">Stock</label>
        <input
          type="number"
          id="stock"
          v-model="itemData.stock"
          class="form-control"
          required
          min="0"
        />
      </div>

      <div class="form-group">
        <label for="image">Image</label>
        <input
          type="file"
          id="image"
          @change="handleImageUpload"
          class="form-control"
        />
        <!-- Image preview -->
        <div
          v-if="imagePreview"
          class="mt-3"
        >
          <img
            :src="imagePreview"
            alt="Image Preview"
            class="img-fluid"
          />
        </div>
        <!-- Display backend image URL -->
        <div
          v-if="itemData.image_url"
          class="mt-3"
        >
          <p>Current Image:</p>
          <img
            :src="itemData.image_url"
            alt="Backend Image"
            class="img-fluid"
          />
        </div>
      </div>

      <div class="d-flex justify-content-between mt-3">
        <router-link
          to="/item-management"
          class="btn btn-secondary"
        >
          Go Back
        </router-link>

        <button
          type="submit"
          class="btn btn-primary"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import itemsServices from '@/services/items.services';

export default {
  data() {
    return {
      itemData: {
        item_name: '',
        price: 0,
        stock: 0,
        image: null,
        image_url: '' // to hold backend image URL
      },
      imagePreview: null // Temp preview for uploaded image
    };
  },
  methods: {
    // Submit the form
    async submitItemForm() {
      try {
        const formData = new FormData();
        formData.append('item_name', this.itemData.item_name);
        formData.append('price', this.itemData.price);
        formData.append('stock', this.itemData.stock);

        if (this.itemData.image) {
          formData.append('image_urlFile', this.itemData.image);
        }

        // Get token from localStorage
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Call API to add item with Authorization token
        const response = await itemsServices.createItem(formData, token);
        console.log(response);
        if (response.status === 'success') {
          console.log('Item Added', response.data.item);
          // Handle success logic (e.g., notify user or redirect)
        }
      } catch (error) {
        console.error('Error adding item', error);
      }
    },

    // Handle image file upload
    handleImageUpload(event) {
      this.itemData.image = event.target.files[0];
      if (this.itemData.image) {
        // Create temporary URL for image preview
        this.imagePreview = URL.createObjectURL(this.itemData.image);
      }
    },

    // If there is an item data passed, set it here (for editing or displaying)
    setItemData(item) {
      this.itemData = { ...item };
    }
  }
};
</script>

<style scoped>
.title {
  text-align: center;
  border: 3px solid #2d8b48;
  padding: 10px;
  border-radius: 16px;
  background-color: #f1f1f1;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* Form container */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Form group */
.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input.form-control,
select.form-control {
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 14px;
}

input.form-control:focus,
select.form-control:focus {
  border-color: #2d8b48;
  box-shadow: 0 0 5px rgba(45, 139, 72, 0.5);
}

/* Hình ảnh */
input[type='file'] {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
}

/* Nút Go Back và Submit */
.d-flex {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn-secondary,
.btn-primary {
  width: 48%;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-primary {
  background-color: #2d8b48;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-primary:hover {
  background-color: #218838;
}

/* Hiệu ứng hover cho nút */
button:hover {
  cursor: pointer;
}

/* Hiệu ứng khi form không có lỗi */
input.form-control:valid,
select.form-control:valid {
  border-color: #28a745;
}
</style>
