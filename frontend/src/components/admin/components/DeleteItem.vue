<template>
  <div class="container mt-5">
    <h2>
      Deleting items <span v-if="items.length">({{ items.length }})</span>
    </h2>

    <form>
      <!-- Search Field -->
      <div class="form-group">
        <label for="search">Search by Item Name:</label>
        <input
          type="text"
          id="search"
          v-model="searchText"
          class="form-control"
          placeholder="Search by item name"
        />
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
          Delete All items
        </button>
      </div>

      <!-- Confirm Delete All -->
      <div
        v-if="confirmDeleteAll"
        class="alert alert-warning mt-3"
      >
        Are you sure you want to delete all items?
        <button
          @click="deleteAllItems"
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

      <!-- List items -->
      <ul class="list-group mt-3">
        <li
          v-for="(item, index) in filteredItems"
          :key="item.item_name"
          class="list-group-item d-flex justify-content-between align-items-center"
          :class="{ 'bg-info': index === selectedIndex }"
          @click="selectItem(index)"
        >
          {{ item.item_name }} - Price: {{ item.price }} - Stock: {{ item.stock }}
          <button
            @click="confirmDeleteItem(item.item_name, $event)"
            class="btn btn-delete-item"
          >
            Delete
          </button>
        </li>
      </ul>

      <!-- Confirm Delete Single Item -->
      <div
        v-if="itemToDelete"
        class="alert alert-warning mt-3"
      >
        <p>Are you sure you want to delete the item "{{ itemToDelete }}"?</p>
        <div class="d-flex justify-content-between">
          <button
            @click="deleteItemByName"
            class="btn btn-danger btn-sm"
          >
            Confirm Deletion
          </button>
          <button
            @click="itemToDelete = null"
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
import ItemsService from '@/services/items.services';

export default {
  data() {
    return {
      items: [],
      searchText: '',
      selectedIndex: -1,
      itemToDelete: null,
      error: null,
      successMessage: null,
      loading: false,
      confirmDeleteAll: false
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchText) return this.items;
      return this.items.filter((item) =>
        item.item_name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    selectedItem() {
      if (this.selectedIndex < 0) return null;
      return this.filteredItems[this.selectedIndex];
    }
  },
  methods: {
    getToken() {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        this.error = 'No token found. Please log in again.';
        return null;
      }
      return token;
    },

    async fetchItems() {
      try {
        this.loading = true;
        const token = this.getToken();
        if (!token) return;

        const response = await ItemsService.fetchAllItems(1, 100); // Fetch all items
        this.items = response; // Store the fetched items
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while fetching items.';
      } finally {
        this.loading = false;
      }
    },

    confirmDeleteItem(itemName, event) {
      event.preventDefault(); // Prevent the default action of the button (form submission)
      this.itemToDelete = itemName;
    },

    async deleteItemByName() {
      if (!this.itemToDelete) return;

      try {
        this.loading = true;
        const token = this.getToken();
        if (!token) return;

        const response = await ItemsService.deleteItem(this.itemToDelete);

        if (response.status === 'success') {
          this.successMessage = `Item "${this.itemToDelete}" deleted successfully.`;
          // Remove the deleted item from the list
          this.items = this.items.filter((item) => item.item_name !== this.itemToDelete);
          this.itemToDelete = null;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while deleting the item.';
      } finally {
        this.loading = false;
      }
    },

    async deleteAllItems() {
      try {
        this.loading = true;
        const token = this.getToken();
        if (!token) return;

        const response = await ItemsService.deleteAllItems();

        if (response.status === 'success') {
          this.successMessage = 'All items have been deleted successfully.';
          this.items = []; // Clear the items list
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while deleting all items.';
      } finally {
        this.loading = false;
        this.confirmDeleteAll = false;
      }
    },

    selectItem(index) {
      this.selectedIndex = index;
    }
  },
  mounted() {
    this.fetchItems(); // Fetch items when the component is mounted
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

.btn-delete-item {
  width: 20%;
  background-color: #d3d3d3;
  border: none;
  color: #333;
}

.btn-delete-item:hover {
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
