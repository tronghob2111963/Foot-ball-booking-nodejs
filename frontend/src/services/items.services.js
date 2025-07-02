import axios from 'axios';

const API_BASE_URL = '/api/v1/items';

/**
 * @returns {string} Token xác thực.
 */
function getAuthToken() {
  return localStorage.getItem('adminToken');
}

/**
 * Hàm thiết lập header với token cho mỗi yêu cầu.
 * @returns {object} Headers chứa token xác thực.
 */
function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetches all items with optional pagination and filtering by item name.
 * @param {string} [itemName] - Optional filter for item name.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=5] - The number of records per page.
 * @returns {Promise<any>} - The items data.
 */
async function fetchAllItems(page, limit) {
  const response = await axios.get(`${API_BASE_URL}`, {
    params: { page, limit }
  });
  return response.data;
}
async function fetchItemId(itemId) {
  const response = await axios.get(`${API_BASE_URL}/${itemId}`);
  return response.data;
}
/**
 * Creates a new item.
 * @param {FormData} itemData - The data for the new item (must include `multipart/form-data`).
 * @returns {Promise<any>} - The created item data.
 */
async function createItem(itemData) {
  const response = await axios.post(API_BASE_URL, itemData, {
    headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * Updates an existing item by ID.
 * @param {number} itemId - The ID of the item to update.
 * @param {FormData} itemData - The updated item data (must include `multipart/form-data`).
 * @returns {Promise<any>} - The updated item data.
 */
async function updateItem(itemId, itemData) {
  const response = await axios.put(`${API_BASE_URL}/${itemId}`, itemData, {
    headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * Deletes an item by ID.
 * @param {number} itemId - The ID of the item to delete.
 * @returns {Promise<any>} - The result of the delete operation.
 */
async function deleteItem(itemId) {
  const response = await axios.delete(`${API_BASE_URL}/${itemId}`, { headers: getAuthHeaders() });
  return response.data;
}

/**
 * Deletes all items in the database.
 * @returns {Promise<any>} - The result of the delete operation.
 */
async function deleteAllItems() {
  const response = await axios.delete(API_BASE_URL, { headers: getAuthHeaders() });
  return response.data;
}

export default {
  fetchAllItems,
  fetchItemId,
  createItem,
  updateItem,
  deleteItem,
  deleteAllItems
};
