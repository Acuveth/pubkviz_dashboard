// src/services/questionsApi.js
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

// Questions API calls
export const questionsApi = {
  getAll: (roomId = null) => {
    const url = roomId 
      ? `${API_BASE_URL}/questions?room_id=${roomId}` 
      : `${API_BASE_URL}/questions`;
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
  
  // Toggle question active status
  toggleActive: (id, isActive) => fetchWithErrorHandling(`${API_BASE_URL}/questions/${id}/toggle-active`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  }),
};

// Question Options API calls
export const optionsApi = {
  getByQuestionId: (questionId) => fetchWithErrorHandling(`${API_BASE_URL}/options?question_id=${questionId}`),
  
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/options/${id}`),
  
  create: (optionData) => fetchWithErrorHandling(`${API_BASE_URL}/options`, {
    method: 'POST',
    body: JSON.stringify(optionData),
  }),
  
  update: (id, optionData) => fetchWithErrorHandling(`${API_BASE_URL}/options/${id}`, {
    method: 'PUT',
    body: JSON.stringify(optionData),
  }),
  
  delete: (id) => fetchWithErrorHandling(`${API_BASE_URL}/options/${id}`, {
    method: 'DELETE',
  }),
  
  // Create or update multiple options at once
  bulkCreateOrUpdate: (questionId, optionsData) => fetchWithErrorHandling(`${API_BASE_URL}/options/bulk/${questionId}`, {
    method: 'POST',
    body: JSON.stringify({ options: optionsData }),
  }),
};