import React, { useEffect } from 'react';

function HomePage() {
  // Set the document title when the component mounts
  useEffect(() => {
    document.title = "MedAssist AI - Dashboard";
    // Optional: Reset the title when the component unmounts if needed
    // return () => {
    //   document.title = "MedAssist AI - Log in"; // Or your default title
    // };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Welcome to MedAssist</h1>
      <p>This is the main dashboard for doctors.</p>
      {/* Add more content and features here as needed */}
    </div>
  );
}

export default HomePage; 