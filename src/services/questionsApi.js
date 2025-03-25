// src/services/questionsApi.js
const API_BASE_URL = 'http://localhost:8000';  // Remove /api since your routes include prefixes

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
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms`),
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms/${id}`),
  
  create: (roomData) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms`, {
    method: 'POST',
    body: JSON.stringify(roomData),
  }),
  
  update: (id, roomData) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms/${id}`, {
    method: 'DELETE',
  }),
  
  // Room menu settings
  getMenuSettings: (roomId) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms/menu-settings/${roomId}`),
  
  createMenuSettings: (settingsData) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms/menu-settings`, {
    method: 'POST',
    body: JSON.stringify(settingsData),
  }),
  
  updateMenuSettings: (roomId, settingsData) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms/menu-settings/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  }),
  
  deleteMenuSettings: (roomId) => fetchWithErrorHandling(`${API_BASE_URL}/api/rooms/menu-settings/${roomId}`, {
    method: 'DELETE',
  }),
};

// Questions API calls
export const questionsApi = {
  getAll: (roomId = null, skip = 0, limit = 100) => {
    const url = roomId
      ? `${API_BASE_URL}/questions?room_id=${roomId}&skip=${skip}&limit=${limit}`
      : `${API_BASE_URL}/questions?skip=${skip}&limit=${limit}`;
    return fetchWithErrorHandling(url);
  },
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/questions/${id}`),
  
  create: (questionData) => fetchWithErrorHandling(`${API_BASE_URL}/questions`, {
    method: 'POST',
    body: JSON.stringify(questionData),
  }),
  
  update: (id, questionData) => fetchWithErrorHandling(`${API_BASE_URL}/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(questionData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/questions/${id}`, {
    method: 'DELETE',
  }),
  
  // Activate a question
  activate: (id) => fetchWithErrorHandling(`${API_BASE_URL}/questions/${id}/activate`, {
    method: 'PATCH',
  }),
  
  // Deactivate a question
  deactivate: (id) => fetchWithErrorHandling(`${API_BASE_URL}/questions/${id}/deactivate`, {
    method: 'PATCH',
  }),
};

// Question Options API calls
export const optionsApi = {
  // Your backend doesn't have a standalone options endpoint,
  // options are part of the question in your implementation
  
  bulkCreateOrUpdate: (questionId, optionsData) => fetchWithErrorHandling(`${API_BASE_URL}/questions/options/bulk/${questionId}`, {
    method: 'POST',
    body: JSON.stringify({ options: optionsData }),
  }),
};

// Authentication API calls (for teams/users)
export const authApi = {
  login: (loginData) => fetchWithErrorHandling(`${API_BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(loginData),
  }),
  
  updateTeamProfile: (profileData, token) => fetchWithErrorHandling(`${API_BASE_URL}/teams/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData),
  }),
  
  // Note: For file uploads like profile pictures, you'll need a different approach
  uploadProfilePicture: (formData, token) => {
    return fetch(`${API_BASE_URL}/teams/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type here as it will be set automatically with the boundary
      },
      body: formData, // FormData object containing the file
    }).then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.detail || `API request failed with status ${response.status}`);
        });
      }
      return response.json();
    });
  },
};