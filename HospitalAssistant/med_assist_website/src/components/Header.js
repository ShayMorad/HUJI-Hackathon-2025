import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    alert("This feature doesn't work yet");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Prefer name, then title, then a generic 'User'
  const userDisplayName = currentUser?.name || currentUser?.title || 'User';

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login'); // Ensure redirection to login page after logout
  };

  return (
    <header className="app-header">
      <Link to="/" className="header-left-link">
        <div className="header-left">
          <span className="user-icon-background">
            <span className="user-icon-char">👤</span>
          </span>
          <span className="greeting-text">{getGreeting()}, {userDisplayName}</span>
        </div>
      </Link>
      <div className="header-right">
        <Link to="/" className="header-icon-button" aria-label="Home">
          🏠
        </Link>
        <button onClick={handleSettingsClick} className="header-icon-button" aria-label="Settings">
          ⚙️
        </button>
        <button onClick={handleLogoutClick} className="header-icon-button logout-icon" aria-label="Logout">
          [→]
        </button>
      </div>
    </header>
  );
}

export default Header; 