import api from './api';

// Mock authentication service
// In production, this would connect to a real backend

export const authService = {
  // Register user
  register: async (email, password, name) => {
    try {
      // For demo: simulate successful registration without real backend
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      // Simulate registration success
      const user = {
        id: Date.now().toString(),
        email,
        name,
      };
      const token = 'demo-token-' + Date.now();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token, message: 'Registration successful!' };
    } catch (error) {
      throw error.message || 'Registration failed';
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      // For demo: simulate successful login without real backend
      const user = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
      };
      const token = 'demo-token-' + Date.now();
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
