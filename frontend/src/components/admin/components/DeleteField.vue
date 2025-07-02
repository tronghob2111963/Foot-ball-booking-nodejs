<template>
  <div class="container mt-5">
    <h2>
      Deleting Fields <span v-if="fields.length">({{ fields.length }})</span>
    </h2>

    <form>
      <!-- Search Field -->
      <div class="form-group">
        <label for="search">Search by Field Name:</label>
        <input
          type="text"
          id="search"
          v-model="searchText"
          class="form-control"
          placeholder="Search by field name"
        />
      </div>

      <div class="form-group mt-3">
        <label for="field-type">Select Field Type:</label>
        <select
          id="field-type"
          v-model="selectedType"
          class="form-control"
        >
          <option value="">All Types</option>
          <option value="5v5">5v5</option>
          <option value="7v7">7v7</option>
          <option value="11v11">11v11</option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-between mt-3">
        <router-link
          to="/field-management"
          class="btn btn-primary"
        >
          Go back to Field Management
        </router-link>
        <button
          v-if="!confirmDeleteAll"
          @click="confirmDeleteAll = true"
          class="btn btn-danger"
        >
          Delete All Fields
        </button>
      </div>

      <!-- Confirm Delete All -->
      <div
        v-if="confirmDeleteAll"
        class="alert alert-warning mt-3"
      >
        Are you sure you want to delete all fields?
        <button
          @click="deleteAllFields"
          class="btn btn-danger btn-sm mt-2"
        >
          Confirm Deletion
        </button>
        <button
          @click="confirmDeleteAll = false"
          class="btn btn-secondary btn-sm mt-2"
        >
          Cancel
        </button>
      </div>

      <!-- List Fields -->
      <ul class="list-group mt-3">
        <li
          v-for="(field, index) in filteredFields"
          :key="field.field_id"
          class="list-group-item d-flex justify-content-between align-items-center"
          :class="{ 'bg-info': index === selectedIndex }"
          @click="selectField(index)"
        >
          {{ field.field_name }} ({{ field.type_fields }}) - Id: {{ field.field_id }} -
          {{ field.status }}
          <button
            @click="confirmDeleteField(field.field_id, $event)"
            class="btn btn-delete-field"
          >
            Delete
          </button>
        </li>
      </ul>

      <!-- Confirm Delete Single Field -->
      <div
        v-if="fieldToDelete"
        class="alert alert-warning mt-3"
      >
        <p>
          Are you sure you want to delete the field with ID
          <strong>{{ fieldToDelete }}</strong
          >?
        </p>
        <div class="d-flex justify-content-between">
          <button
            @click="deleteFieldById"
            class="btn btn-danger btn-sm"
          >
            Confirm Deletion
          </button>
          <button
            @click="fieldToDelete = null"
            class="btn btn-secondary btn-sm"
          >
            Cancel
          </button>
        </div>
      </div>
      <div
        v-if="error"
        class="alert alert-danger mt-3"
      >
        {{ error }}
      </div>
      <div
        v-if="successMessage"
        class="alert alert-success mt-3"
      >
        {{ successMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import fieldsServices from '@/services/fields.services';

export default {
  data() {
    return {
      fields: [],
      searchText: '',
      selectedType: '',
      selectedIndex: -1,
      fieldToDelete: null,
      error: null,
      successMessage: null,
      loading: false,
      confirmDeleteAll: false
    };
  },
  computed: {
    searchableFields() {
      return this.fields.map((field) => {
        const { field_name } = field;
        return [field_name].join(' ').toLowerCase();
      });
    },

    filteredFields() {
      if (!this.searchText && !this.selectedType) return this.fields;
      return this.fields.filter((field, index) => {
        const isTextMatch = this.searchableFields[index].includes(this.searchText.toLowerCase());
        const isTypeMatch = this.selectedType ? field.type_fields === this.selectedType : true;

        return isTextMatch && isTypeMatch;
      });
    },

    selectedField() {
      if (this.selectedIndex < 0) return null;
      return this.filteredFields[this.selectedIndex];
    }
  },
  methods: {
    getToken() {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        this.error = 'No token found. Please log in again.';
        this.loading = false;
        return null;
      }
      return token;
    },

    async fetchFields() {
      try {
        this.loading = true;
        const token = this.getToken();
        if (!token) return;

        const response = await fieldsServices.fetchFields(1, 100); // Fetch all fields
        this.fields = response.data.fields || [];
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while fetching fields.';
      } finally {
        this.loading = false;
      }
    },

    /**
     * Confirms the deletion of a field by its ID.
     * @param {number} fieldId
     * @returns {Promise<any>}
     */
    confirmDeleteField(field_Id, event) {
      event.preventDefault(); // Ngừng hành động mặc định của nút (ngừng gửi form)
      // event.stopPropagation(); // Ngừng sự kiện click lan truyền lên các phần tử cha
      this.fieldToDelete = field_Id;
      console.log(this.fieldToDelete); // Lưu ID của field cần xóa
    },

    async deleteFieldById() {
      if (!this.fieldToDelete) {
        console.log('No field selected for deletion.'); // Thêm log để kiểm tra trường hợp không có field cần xóa
        return;
      }

      try {
        this.loading = true;
        const token = this.getToken();
        if (!token) return;

        console.log('Deleting field with ID:', this.fieldToDelete); // Log ID của field muốn xóa

        const response = await fieldsServices.deleteField(token, this.fieldToDelete);

        if (response.status === 'success') {
          this.successMessage = `Field ${this.fieldToDelete} deleted successfully.`;

          // Cập nhật lại danh sách các trường mà không cần tải lại trang
          this.fields = this.fields.filter((field) => field.field_id !== this.fieldToDelete);
          this.fieldToDelete = null; // Reset lại ID của field sau khi xóa
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while deleting the field.';
      } finally {
        this.loading = false;
      }
    },

    async deleteAllFields() {
      try {
        this.loading = true;
        const token = this.getToken();
        if (!token) return;

        const response = await fieldsServices.deleteAllField();

        if (response.status === 'success') {
          this.successMessage = 'All fields have been deleted successfully.';
          this.fields = [];
        }
      } catch (error) {
        this.error =
          error.response?.data?.message || 'An error occurred while deleting all fields.';
      } finally {
        this.loading = false;
        this.confirmDeleteAll = false;
      }
    },

    selectField(index) {
      this.selectedIndex = index; // Set the selected field index when clicked
    }
  },
  mounted() {
    this.fetchFields(); // Fetch the fields when the component is mounted
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.alert {
  margin-top: 10px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
}

.btn-danger {
  width: 48%;
}

.btn-delete-field {
  width: 20%;
  background-color: #d3d3d3;
  border: none;
  color: #333;
}

.btn-delete-field:hover {
  background-color: #a9a9a9;
  transform: scale(1.1);
}

.btn-delete-all {
  background-color: #dc3545;
  width: 100%;
}

.btn-delete-all:hover {
  background-color: #c82333;
}
</style>
