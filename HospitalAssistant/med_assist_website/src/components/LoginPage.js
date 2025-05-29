import React, { useState } from 'react';
import { authService } from '../services/authService'; // Import the auth service
import './LoginPage.css'; // Import the new CSS file

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for login errors
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);
    try {
      // Use the authService to login
      await authService.login(username, password);
      console.log('Login successful for:', username);
      onLogin(); // Call the onLogin prop function if credentials are valid
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(err.message || 'Login failed. Please try again.'); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault(); // Prevent the default anchor tag behavior
    alert("This feature doesn't work yet");
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/login_page/MedAssistLogo.png" alt="Logo" /> 
      </div>
      <form onSubmit={handleLogin}>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          {/* Using a placeholder for icon, can be replaced with actual icon component or SVG */}
          {/* <span className="icon">&#128100;</span> */}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading} // Disable input while loading
            required
          />
        </div>
        <div className="input-group">
          {/* <span className="icon">&#128274;</span> */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading} // Disable input while loading
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
        <div className="forgot-password">
          <a href="#" onClick={handleForgotPasswordClick}>Forgot Password?</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage; 