// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';

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

// Menu API calls
export const menuApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/menus`),
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menus/${id}`),
  
  create: (menuData) => fetchWithErrorHandling(`${API_BASE_URL}/menus`, {
    method: 'POST',
    body: JSON.stringify(menuData),
  }),
  
  update: (id, menuData) => fetchWithErrorHandling(`${API_BASE_URL}/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menuData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menus/${id}`, {
    method: 'DELETE',
  }),
};

// Category API calls
export const categoryApi = {
  getAll: (menuId = null) => {
    const url = menuId 
      ? `${API_BASE_URL}/categories?menu_id=${menuId}` 
      : `${API_BASE_URL}/categories`;
    return fetchWithErrorHandling(url);
  },
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`),
  
  create: (categoryData) => fetchWithErrorHandling(`${API_BASE_URL}/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  
  update: (id, categoryData) => fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Menu Item API calls
export const menuItemApi = {
  getAll: (categoryId = null) => {
    const url = categoryId 
      ? `${API_BASE_URL}/menu-items?category_id=${categoryId}` 
      : `${API_BASE_URL}/menu-items`;
    return fetchWithErrorHandling(url);
  },
  
  getByMenuId: (menuId) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/menu-items/by-menu/${menuId}`);
  },
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu-items/${id}`),
  
  create: (itemData) => fetchWithErrorHandling(`${API_BASE_URL}/menu-items`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  
  update: (id, itemData) => fetchWithErrorHandling(`${API_BASE_URL}/menu-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menu-items/${id}`, {
    method: 'DELETE',
  }),
};

// Item Options API calls
export const itemOptionApi = {
  getAll: (menuItemId = null) => {
    const url = menuItemId 
      ? `${API_BASE_URL}/item-options?menu_item_id=${menuItemId}` 
      : `${API_BASE_URL}/item-options`;
    return fetchWithErrorHandling(url);
  },
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/item-options/${id}`),
  
  create: (optionData) => fetchWithErrorHandling(`${API_BASE_URL}/item-options`, {
    method: 'POST',
    body: JSON.stringify(optionData),
  }),
  
  update: (id, optionData) => fetchWithErrorHandling(`${API_BASE_URL}/item-options/${id}`, {
    method: 'PUT',
    body: JSON.stringify(optionData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/item-options/${id}`, {
    method: 'DELETE',
  }),
};