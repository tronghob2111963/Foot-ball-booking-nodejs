<template>
  <div class="container mt-5">
    <h2>Field Management</h2>
    <div class="button-group mb-4">
      <div class="btn-container">
        <span
          v-if="!showAddOptions"
          class="option-btn"
          @click="toggleAddOption"
        >
          Adding Option
        </span>
        <div
          v-if="showAddOptions"
          class="add-options"
        >
          <span
            @click="navigateTo('addfield')"
            class="button btn-success"
            >Add Field</span
          >
          <span
            @click="navigateTo('additems')"
            class="button btn-success"
            >Add Items</span
          >
        </div>
      </div>
      <router-link
        class="button btn-success"
        :to="'/edit-field'"
        >Edit Field</router-link
      >
      <span
        v-if="!showAddOptions"
        class="option-btn"
        @click="toggleAddOption"
      >
        Deleting Option
      </span>
      <div
        v-if="showAddOptions"
        class="add-options"
      >
        <span
          @click="navigateTo('deletefield')"
          class="button btn-success"
          >Delete Field</span
        >
        <span
          @click="navigateTo('deleteitems')"
          class="button btn-success"
          >Delete Items</span
        >
      </div>
    </div>
    <div class="row">
      <!-- Section for Fields -->
      <div class="col-md-4 mb-3">
        <div class="section-box">
          <h4>Sân và Trạng Thái</h4>
          <p>Danh sách sân với trạng thái của chúng.</p>
          <ul class="list-group">
            <li
              v-for="(field, index) in fields"
              :key="field.field_id"
              class="list-group-item d-flex justify-content-between align-items-center"
              :class="{ 'bg-info': index === selectedFieldIndex }"
              @click="selectField(field, index)"
            >
              {{ field.field_name }} (Status: {{ field.status }})
              <button
                @click="EditField(field, $event)"
                class="btn btn-Edit-field"
              >
                <i class="fas fa-edit"></i>
                Edit
              </button>
            </li>
          </ul>
          <!-- Pagination for Fields -->
          <div class="pagination">
            <button
              @click="changeFieldPage(fieldPage - 1)"
              :disabled="fieldPage <= 1"
              class="pagination-btn"
            >
              Prev
            </button>
            <span>Page {{ fieldPage }} of {{ totalFieldPages }}</span>
            <button
              @click="changeFieldPage(fieldPage + 1)"
              :disabled="fieldPage >= totalFieldPages"
              class="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Section for Items -->
      <div class="col-md-4 mb-3">
        <div class="section-box">
          <h4>Items và Stock</h4>
          <p>Thông tin về các item và số lượng tồn kho.</p>
          <ul class="list-group">
            <li
              v-for="(item, index) in items"
              :key="item.item_id"
              class="list-group-item d-flex justify-content-between align-items-center"
              :class="{ 'bg-info': index === selectedItemIndex }"
              @click="selectItem(item, index)"
            >
              {{ item.item_name }} - Stock: {{ item.stock }}
              <button
                @click="EditItem(item, $event)"
                class="btn btn-Edit-item"
              >
                <i class="fas fa-edit"></i>
                Edit
              </button>
            </li>
          </ul>
          <!-- Pagination for Items -->
          <div class="pagination">
            <button
              @click="changeItemPage(itemPage - 1)"
              :disabled="itemPage <= 1"
              class="pagination-btn"
            >
              Prev
            </button>
            <span>Page {{ itemPage }} of {{ totalItemPages }}</span>
            <button
              @click="changeItemPage(itemPage + 1)"
              :disabled="itemPage >= totalItemPages"
              class="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Section for Revocations -->
      <div class="col-md-4 mb-3">
        <div class="section-box">
          <h4>Revocations</h4>
          <p>Thông tin về các revocations.</p>
          <ul class="list-group">
            <li
              v-for="revocation in revocations"
              :key="revocation.id"
              class="list-group-item d-flex justify-content-between align-items-center"
              @click="selectRevocation(revocation)"
            >
              {{ revocation.description }}
              <button
                @click="EditRevocation(revocation, $event)"
                class="btn btn-Edit-revocation"
              >
                <i class="fas fa-edit"></i>
                Edit
              </button>
            </li>
          </ul>
          <!-- Pagination for Revocations -->
          <div class="pagination">
            <button
              @click="changeRevocationPage(revocationPage - 1)"
              :disabled="revocationPage <= 1"
              class="pagination-btn"
            >
              Prev
            </button>
            <span>Page {{ revocationPage }} of {{ totalRevocationPages }}</span>
            <button
              @click="changeRevocationPage(revocationPage + 1)"
              :disabled="revocationPage >= totalRevocationPages"
              class="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FieldService from '@/services/fields.services.js';
import ItemsService from '@/services/items.services.js';

const router = useRouter();

// State for fields, items, and revocations
const fields = ref([]);
const items = ref([]);
const revocations = ref([]);

// Selected indices
const selectedFieldIndex = ref(null);
const selectedItemIndex = ref(null);
const selectedRevocationIndex = ref(null);

// Pagination states for fields, items, and revocations
const fieldPage = ref(1);
const itemPage = ref(1);
const revocationPage = ref(1);

const totalFieldPages = ref(1);
const totalItemPages = ref(1);
const totalRevocationPages = ref(1);

const limit = 5; // Number of items per page

// Fetch fields data
const fetchFields = async (page) => {
  try {
    const response = await FieldService.fetchFields(page, limit);
    fields.value = response.data.fields;
    totalFieldPages.value = response.totalPages || 1;
  } catch (error) {
    console.error('Error fetching fields:', error);
  }
};

// Fetch items data
const fetchItems = async (page) => {
  try {
    const response = await ItemsService.fetchAllItems(page, limit);
    items.value = response;
    totalItemPages.value = response.totalPages || 1;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

// Fetch revocations data (if applicable)
const fetchReservation = async () => {
  revocations.value = [
    { id: 1, description: 'Revocation 1' },
    { id: 2, description: 'Revocation 2' }
  ];
};

// Handle field selection
const selectField = (field, index) => {
  // Reset the selection in other sections
  selectedItemIndex.value = null;
  selectedRevocationIndex.value = null;
  selectedFieldIndex.value = index;
  console.log('Selected Field:', field);
};

// Handle item selection
const selectItem = (item, index) => {
  // Reset the selection in other sections
  selectedFieldIndex.value = null;
  selectedRevocationIndex.value = null;
  selectedItemIndex.value = index;
  console.log('Selected Item:', item);
};

// Handle revocation selection
const selectRevocation = (revocation) => {
  // Reset the selection in other sections
  selectedFieldIndex.value = null;
  selectedItemIndex.value = null;
  selectedRevocationIndex.value = revocation.id;
  console.log('Selected Revocation:', revocation);
};

// Edit a field
const EditField = (field, event) => {
  event.stopPropagation();
  console.log('Edit Field:', field);
  // Implement Edit functionality here
};

// Edit an item
const EditItem = (item, event) => {
  event.stopPropagation();
  console.log('Edit Item:', item);
  // Implement Edit functionality here
};

// Edit a revocation
const EditRevocation = (revocation, event) => {
  event.stopPropagation();
  console.log('Edit Revocation:', revocation);
  // Implement Edit functionality here
};

// Pagination navigation for fields
const changeFieldPage = (newPage) => {
  if (newPage > 0 && newPage <= totalFieldPages.value) {
    fieldPage.value = newPage;
    fetchFields(fieldPage.value);
  }
};

// Pagination navigation for items
const changeItemPage = (newPage) => {
  if (newPage > 0 && newPage <= totalItemPages.value) {
    itemPage.value = newPage;
    fetchItems(itemPage.value);
  }
};

// Pagination navigation for revocations
const changeRevocationPage = (newPage) => {
  if (newPage > 0 && newPage <= totalRevocationPages.value) {
    revocationPage.value = newPage;
    fetchRevocations();
  }
};
const showAddOptions = ref(false);

// Function to toggle visibility of Add options
const toggleAddOption = () => {
  showAddOptions.value = !showAddOptions.value;
};

// Function to navigate to different routes
const navigateTo = (route) => {
  if (route === 'addfield') {
    router.push({ name: 'addfield' });
  } else if (route === 'additems') {
    router.push({ name: 'additems' });
  } else if (route === 'deletefield') {
    router.push({ name: 'deleteallfield' });
  } else if (route === 'deleteitems') {
    router.push({ name: 'deleteAllItems' });
  }
};
// Check if admin is logged in
onMounted(() => {
  if (!localStorage.getItem('isAdminLoggedIn')) {
    router.push({ name: 'login-admin' });
  } else {
    fetchFields(fieldPage.value);
    fetchItems(itemPage.value);
    fetchReservation(); // If you want to fetch revocations data
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  text-align: center;
  margin-bottom: 2rem;
}
a {
  text-decoration: none;
  padding: 12px 25px; /* Adjust padding to make the buttons more comfortable */
  margin-left: 10px;
  border-radius: 6px;
  background-color: #28a745; /* Green background to match the button color */
  color: white;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Softer shadow for a more prominent effect */
  width: auto; /* Make width auto so buttons fit the text */
  min-width: 160px; /* Ensure buttons are wide enough to accommodate text */
  text-align: center;
  line-height: 1.5; /* Improve vertical alignment */
}

/* Hover effect for the button */
a:hover {
  opacity: 0.8;
  transform: translateY(-3px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow */
}

h4,
h4 + p {
  text-align: center; /* Center align both h4 and its following p element */
}
.btn-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.button-group {
  display: flex;
  justify-content: center; /* Canh giữa các link */
  gap: 10px;
  width: 100%;
  max-width: fit-content; /* Tăng kích thước tối đa để cân đối */
  margin: 0 auto; /* Đảm bảo button-group được canh giữa */
}
.button:hover {
  opacity: 0.8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.row {
  display: flex;
  justify-content: space-between;
}
.btn {
  background-color: darkgoldenrod;
  padding: 5px 10px; /* Giảm padding */
  font-size: 12px; /* Giảm kích thước font chữ */
  border-radius: 5px; /* Giảm độ bo góc của nút */
  height: auto; /* Giữ chiều cao tự động */
  min-width: 80px; /* Đặt kích thước tối thiểu cho nút */
}
.section-box {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Ensures all section-boxes grow equally */
  position: relative;
  min-height: 500px; /* Fixed height */
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bg-info {
  background-color: #d3f0ff;
}

/* Ensure pagination is at the bottom */
.pagination {
  position: absolute;
  bottom: 10px; /* Distance from the bottom */
  left: 50%;
  transform: translateX(-50%); /* Center horizontally */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
}

.pagination-btn {
  font-size: 12px; /* Smaller button size */
  padding: 5px 8px;
  margin: 0 5px;
}

.pagination button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
}

.pagination span {
  font-weight: bold;
  margin: 0 5px;
}
.btn:hover {
  opacity: 0.8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.add-options {
  display: flex;
  flex-direction: column; /* Đảm bảo các nút sẽ hiển thị theo chiều dọc */
  gap: 10px;
  margin-top: 10px;
  padding-left: 15px;
  border-radius: 5px; /* Bo góc cho viền */
}

.add-options .button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  border: 1px solid #000; /* Viền đen cho các nút */
}

.add-options .button:hover {
  background-color: #218838;
  transform: translateY(-3px); /* Tạo hiệu ứng di chuyển lên khi hover */
}
</style>
