// src/services/api.js
const API_BASE_URL = 'http://localhost:8000';  // Remove /api since your routes include that prefix

// Helper function for making fetch requests
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Menu API calls - update to use the correct paths from your menu router
export const menuApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories`),
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories/${id}`),
  
  create: (menuData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories`, {
    method: 'POST',
    body: JSON.stringify(menuData),
  }),
  
  update: (id, menuData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menuData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories/${id}`, {
    method: 'DELETE',
  }),
  
  // Add method to get menu for a specific room
  getForRoom: (roomId) => fetchWithErrorHandling(`${API_BASE_URL}/menu/room/${roomId}`),
  
  // Get popular items
  getPopularItems: () => fetchWithErrorHandling(`${API_BASE_URL}/menu/popular`),
};

// Category API calls - now using the menu category endpoints
export const categoryApi = {
  getAll: (skip = 0, limit = 100) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/menu/categories?skip=${skip}&limit=${limit}`);
  },
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories/${id}`),
  
  create: (categoryData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  
  update: (id, categoryData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Menu Item API calls
export const menuItemApi = {
  getAll: (categoryId = null, skip = 0, limit = 100) => {
    const url = categoryId
      ? `${API_BASE_URL}/menu/items?category_id=${categoryId}&skip=${skip}&limit=${limit}`
      : `${API_BASE_URL}/menu/items?skip=${skip}&limit=${limit}`;
    return fetchWithErrorHandling(url);
  },
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/items/${id}`),
  
  create: (itemData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/items`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  
  update: (id, itemData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/items/${id}`, {
    method: 'DELETE',
  }),
  
  // Get popular items
  getPopular: () => fetchWithErrorHandling(`${API_BASE_URL}/menu/popular`),
};

// Item Options API calls
export const itemOptionApi = {
  getAll: (itemId = null, skip = 0, limit = 100) => {
    const url = itemId
      ? `${API_BASE_URL}/menu/options?item_id=${itemId}&skip=${skip}&limit=${limit}`
      : `${API_BASE_URL}/menu/options?skip=${skip}&limit=${limit}`;
    return fetchWithErrorHandling(url);
  },
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/options/${id}`),
  
  create: (itemId, optionData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/items/${itemId}/options`, {
    method: 'POST',
    body: JSON.stringify(optionData),
  }),
  
  update: (id, optionData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/options/${id}`, {
    method: 'PUT',
    body: JSON.stringify(optionData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu/options/${id}`, {
    method: 'DELETE',
  }),
};

// Add room menu settings API
export const roomMenuSettingsApi = {
  get: (roomId) => fetchWithErrorHandling(`${API_BASE_URL}/menu/settings/${roomId}`),
  
  createOrUpdate: (settingsData) => fetchWithErrorHandling(`${API_BASE_URL}/menu/settings`, {
    method: 'POST',
    body: JSON.stringify(settingsData),
  }),
};