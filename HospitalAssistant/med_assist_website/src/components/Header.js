import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    alert("This feature doesn't work yet");
  };

  const handleLanguageClick = () => {
    alert("Language selection feature is not implemented yet.");
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

  const iconPath = `${process.env.PUBLIC_URL}/home_page/`;

  return (
    <header className="app-header">
      <Link to="/" className="header-left-link">
        <div className="header-left">
          {/* Placeholder for user image - replace if actual image is available */}
          <span className="user-icon-background">
            {/* <img src={currentUser?.profileImageUrl || `${iconPath}default-user.png`} alt="User" className="user-profile-img" /> */}
            <span className="user-icon-char">👤</span>
          </span>
          <span className="greeting-text">{getGreeting()}, {userDisplayName}</span>
        </div>
      </Link>
      <div className="header-right">
        <button onClick={handleLanguageClick} className="header-lang-button" aria-label="Select Language">
          EN
        </button>
        <Link to="/" className="header-icon-link" aria-label="Home">
          <img src={`${iconPath}icons8-home-50.png`} alt="Home" className="header-icon-img" />
        </Link>
        <button onClick={handleSettingsClick} className="header-icon-button" aria-label="Settings">
          <img src={`${iconPath}icons8-gear-50.png`} alt="Settings" className="header-icon-img" />
        </button>
        <button onClick={handleLogoutClick} className="header-icon-button" aria-label="Logout">
          <img src={`${iconPath}icons8-logout-50.png`} alt="Logout" className="header-icon-img logout-img-icon" />
        </button>
      </div>
    </header>
  );
}

export default Header; 