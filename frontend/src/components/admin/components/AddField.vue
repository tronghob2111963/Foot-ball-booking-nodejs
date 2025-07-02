<template>
  <div class="container mt-5">
    <h2 class="title">Add New Field</h2>
    <form @submit.prevent="submitFieldForm">
      <div class="form-group">
        <label for="field_name">Field Name</label>
        <input
          type="text"
          id="field_name"
          v-model="fieldData.field_name"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="type_fields">Field Type</label>
        <select
          id="type_fields"
          v-model="fieldData.type_fields"
          class="form-control"
          required
        >
          <option value="5v5">5v5</option>
          <option value="7v7">7v7</option>
          <option value="11v11">11v11</option>
        </select>
      </div>

      <div class="form-group">
        <label for="price_per_hour">Price Per Hour</label>
        <input
          type="number"
          id="price_per_hour"
          v-model="fieldData.price_per_hour"
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
        <!-- Phần xem trước ảnh -->
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
      </div>

      <div class="d-flex justify-content-between mt-3">
        <router-link
          to="/field-management"
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
import fieldsServices from '@/services/fields.services';
export default {
  data() {
    return {
      fieldData: {
        field_name: '',
        type_fields: '',
        price_per_hour: 0.1,
        image: null
      },
      imagePreview: null // Biến lưu trữ URL ảnh xem trước
    };
  },
  methods: {
    // Hàm gửi form
    async submitFieldForm() {
      try {
        const formData = new FormData();
        formData.append('field_name', this.fieldData.field_name);
        formData.append('type_fields', this.fieldData.type_fields);
        formData.append('price_per_hour', this.fieldData.price_per_hour);
        if (this.fieldData.image) {
          formData.append('image_urlFile', this.fieldData.image);
        }

        // Lấy token từ localStorage
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Gọi API để thêm sân với header Authorization chứa token
        const response = await fieldsServices.createField(formData, token);

        if (response.status === 'success') {
          console.log('Field Added', response.data.field);
          // Có thể thêm logic để thông báo hoặc chuyển hướng đến trang khác sau khi thêm thành công
        }
      } catch (error) {
        console.error('Error adding field', error);
      }
    },

    // Hàm xử lý khi chọn hình ảnh
    handleImageUpload(event) {
      this.fieldData.image = event.target.files[0];
      if (this.fieldData.image) {
        // Tạo URL tạm thời cho ảnh xem trước
        this.imagePreview = URL.createObjectURL(this.fieldData.image);
      }
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
