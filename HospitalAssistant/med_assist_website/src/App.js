import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  // For this example, we'll use a simple isLoggedIn state.
  // In a real application, this would involve more robust authentication.
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Mock login function
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Mock logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Apply body styles when the App component mounts
  useEffect(() => {
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/hospital_background.jpg)`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    document.body.style.margin = '0'; // Ensure no default margin

    // Cleanup function to remove styles when the component unmounts
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
      document.body.style.height = '';
      document.body.style.margin = '';
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <Router>
      <div className="App">
        <nav>
          {isLoggedIn && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/" 
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
