// frontend/src/api.js
// API service for making requests to the backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api';


// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// ============ AUTH API CALLS ============

export const signup = async (email, password, name) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name })
  });
  
  return handleResponse(response);
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  return handleResponse(response);
};

// ============ HABIT API CALLS ============

export const getHabits = async () => {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const createHabit = async (habitData) => {
  // habitData should contain: { title, description, frequency, startDate }
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(habitData)
  });
  
  return handleResponse(response);
};

export const updateHabit = async (id, habitData) => {
  const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(habitData)
  });
  
  return handleResponse(response);
};

export const deleteHabit = async (id) => {
  const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const toggleHabit = async (id, date) => {
  // date should be in ISO format (e.g., "2025-11-24")
  const response = await fetch(`${API_BASE_URL}/habits/${id}/toggle`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ date })
  });
  
  return handleResponse(response);
};

// Export the base URL in case it's needed elsewhere
export { API_BASE_URL };