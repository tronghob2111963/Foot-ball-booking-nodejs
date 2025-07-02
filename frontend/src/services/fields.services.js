import axios from 'axios';

const API_BASE_URL = '/api/v1/fields';

/**
 * Lấy token từ localStorage hoặc từ nơi bạn lưu trữ token
 * @returns {string} Token xác thực
 */
function getAuthToken() {
  return localStorage.getItem('adminToken');
}

/**
 * Hàm thiết lập header với token cho mỗi yêu cầu
 * @returns {object} Headers chứa token xác thực
 */
function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetches fields with optional pagination and filtering.
 * @param {number} page
 * @param {number} limit
 * @param {string} [typeFields]
 * @returns {Promise<any>}
 */
async function fetchFields(page = 1, limit = 100, typeFields) {
  let url = `${API_BASE_URL}?page=${page}&limit=${limit}`;
  if (typeFields) {
    url += `&type_fields=${typeFields}`;
  }
  const response = await axios.get(url, { headers: getAuthHeaders() });
  return response.data;
}

/**
 * Fetch a specific field by ID.
 * @param {number} fieldId - The ID of the field to fetch.
 * @returns {Promise<any>} - The field data.
 */
async function fetchFieldById(fieldId) {
  const response = await axios.get(`${API_BASE_URL}/${fieldId}`, { headers: getAuthHeaders() });
  return response.data;
}

/**
 * Creates a new field.
 * @param {object} fieldData - The data for the new field.
 * @returns {Promise<any>} - The created field data.
 */
async function createField(fieldData) {
  const response = await axios.post(API_BASE_URL, fieldData, { headers: getAuthHeaders() });
  return response.data;
}

/**
 * Updates a field by ID.
 * @param {number} fieldId - The ID of the field to update.
 * @param {object} fieldData - The updated field data.
 * @returns {Promise<any>} - The updated field data.
 */
async function updateField(fieldId, fieldData) {
  const response = await axios.put(`${API_BASE_URL}/${fieldId}`, fieldData, {
    headers: getAuthHeaders()
  });
  return response.data;
}

/**
 * Deletes a field by ID.
 * @param {number} fieldId - The ID of the field to delete.
 * @returns {Promise<any>} - The result of the delete operation.
 */
async function deleteField(field_Id) {
  const response = await axios.delete(`${API_BASE_URL}/${field_Id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
}
/**
 * Deletes all fields in the database.
 * @returns {Promise<any>} - The result of the delete operation.
 */
async function deleteAllField() {
  const response = await axios.delete(`${API_BASE_URL}`, {
    headers: getAuthHeaders()
  });
  return response.data;
}

export default {
  fetchFields,
  fetchFieldById,
  createField,
  updateField,
  deleteAllField,
  deleteField
};
