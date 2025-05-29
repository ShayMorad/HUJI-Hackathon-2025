import users from '../users.json';

// Simulates an API call for login
const login = async (username, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // In a real backend call, you might receive a token or user object here
        resolve({ success: true, user: { username: user.username } });
      } else {
        reject({ success: false, message: 'Invalid username or password' });
      }
    }, 500); // 0.5 second delay
  });
};

// Placeholder for a future logout API call
const logout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Logged out successfully' });
    }, 200);
  });
};

export const authService = {
  login,
  logout,
  // We can add other auth-related functions here later (e.g., register, forgotPassword)
}; 