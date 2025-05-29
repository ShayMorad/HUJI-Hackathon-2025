import users from '../users.json';

const USER_STORAGE_KEY = 'currentUser';

// Simulates an API call for login
const login = async (username, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Store the full user object in localStorage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        // Resolve with the full user object
        resolve({ success: true, user }); 
      } else {
        reject({ success: false, message: 'Invalid username or password' });
      }
    }, 500); // 0.5 second delay
  });
};

// Placeholder for a future logout API call
const logout = async () => {
  // Remove user from localStorage on logout
  localStorage.removeItem(USER_STORAGE_KEY);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Logged out successfully' });
    }, 200);
  });
};

// Function to get the current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      // Optionally remove invalid item
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  }
  return null;
};

export const authService = {
  login,
  logout,
  getCurrentUser, // Export the new function
  // We can add other auth-related functions here later (e.g., register, forgotPassword)
}; 