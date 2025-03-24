// src/services/roomsApi.js
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

// Rooms API calls
export const roomsApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/rooms`),
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/rooms/${id}`),
  
  create: (roomData) => fetchWithErrorHandling(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    body: JSON.stringify(roomData),
  }),
  
  update: (id, roomData) => fetchWithErrorHandling(`${API_BASE_URL}/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/rooms/${id}`, {
    method: 'DELETE',
  }),
};

// Room Menu Settings API calls
export const roomMenuSettingsApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/room-menu-settings`),
  
  getByRoomId: (roomId) => fetchWithErrorHandling(`${API_BASE_URL}/room-menu-settings/${roomId}`),
  
  create: (settingsData) => fetchWithErrorHandling(`${API_BASE_URL}/room-menu-settings`, {
    method: 'POST',
    body: JSON.stringify(settingsData),
  }),
  
  update: (roomId, settingsData) => fetchWithErrorHandling(`${API_BASE_URL}/room-menu-settings/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  }),
  
  delete: (roomId) => fetchWithErrorHandling(`${API_BASE_URL}/room-menu-settings/${roomId}`, {
    method: 'DELETE',
  }),
};

// Get available menus (uses the existing menu API)
export const getAvailableMenus = () => fetchWithErrorHandling(`${API_BASE_URL}/menus?is_active=true`);