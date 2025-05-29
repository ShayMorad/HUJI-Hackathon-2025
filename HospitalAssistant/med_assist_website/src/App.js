import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Header from './components/Header';
import PatientsStatusPage from './components/PatientsStatusPage';
import { authService } from './services/authService';
import './App.css';

function App() {
  // Initialize isLoggedIn based on whether a user is found in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getCurrentUser());
  // Optional: store the full user object if needed in App or to pass to children
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  const handleLogin = () => {
    const user = authService.getCurrentUser(); // Get user after authService.login has set it
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    } else {
      // This case should ideally not happen if login was successful in authService
      // but as a fallback:
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => { // Make it async if authService.logout is async
    await authService.logout(); // Call the service to clear localStorage
    setIsLoggedIn(false);
    setCurrentUser(null);
    document.title = "MedAssist AI - Log in";
  };

  // Apply body styles when the App component mounts
  useEffect(() => {
    // Common body styles
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/global/hospital_background.jpg)`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';

    if (!isLoggedIn) {
      // Centering styles for login page
      document.body.style.display = 'flex';
      document.body.style.justifyContent = 'center';
      document.body.style.alignItems = 'center';
    } else {
      // Reset display for pages with header (allowing them to flow normally)
      document.body.style.display = ''; // Or 'block' if needed, default is usually fine
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
    }

    // Cleanup function
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
    };
  }, [isLoggedIn]); // Re-run this effect if isLoggedIn changes

  return (
    <Router>
      {/* Main app container for potential global padding */} 
      <div className={`App ${isLoggedIn ? 'App-with-header' : ''}`}>
        {isLoggedIn && <Header currentUser={currentUser} onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/" 
            element={isLoggedIn ? <HomePage currentUser={currentUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/patients-status" 
            element={isLoggedIn ? <PatientsStatusPage /> : <Navigate to="/login" />} 
          />
          {/* Add a route for SettingsPage when it's created */}
          {/* <Route path="/settings" element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
