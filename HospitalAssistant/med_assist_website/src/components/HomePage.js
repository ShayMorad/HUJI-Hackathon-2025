import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage({ currentUser }) {
  // Set the document title when the component mounts
  useEffect(() => {
    document.title = "MedAssist AI - Dashboard";
    // Optional: Reset the title when the component unmounts if needed
    // return () => {
    //   document.title = "MedAssist AI - Log in"; // Or your default title
    // };
  }, []); // Empty dependency array means this effect runs once on mount

  // Determine user's role for conditional rendering or display
  const userRole = currentUser?.function || 'user'; // Default to 'user' if function is not defined

  return (
    <div className="homepage-container">
      <h1>Welcome to MedAssist, {currentUser?.name || 'User'}!</h1>
      <p>This is the main dashboard. Your role: {userRole}</p>
      
      {/* Placeholder for navigation icons/cards */}
      <div className="dashboard-navigation">
        <Link to="/patients-status" className="dashboard-nav-item">
          <div className="nav-item-icon-placeholder">🩺</div> {/* Placeholder icon */}
          <span>Patients Status</span>
        </Link>
        {/* Add more navigation items here as they are designed */}
      </div>

      {/* Add more content and features here as needed */}
    </div>
  );
}

export default HomePage; 