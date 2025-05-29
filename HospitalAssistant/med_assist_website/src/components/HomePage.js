import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import heroBackgroundImage from '../assets/images/hero_background.jpg'; // Importer l'image

// Structure de données pour les services pour faciliter le mapping
const services = [
  {
    id: 'patients',
    title: 'Patient Status',
    icon: `${process.env.PUBLIC_URL}/home_page/PatientIcon.jpg`,
    alt: 'Patient in bed with doctor',
    linkTo: '/patients-status' // Lien existant
  },
  {
    id: 'staff',
    title: 'Staff Overview',
    icon: `${process.env.PUBLIC_URL}/home_page/Staff Icon.avif`,
    alt: 'Medical staff group',
    linkTo: '/staff' // Exemple de lien, à définir
  },
  {
    id: 'stats',
    title: 'Hospital Stats',
    icon: `${process.env.PUBLIC_URL}/home_page/Stats Icon.png`,
    alt: 'Bar chart statistics',
    linkTo: '/statistics' // Exemple de lien, à définir
  },
  {
    id: 'release',
    title: 'Discharge Center',
    icon: `${process.env.PUBLIC_URL}/home_page/Release Assistance Icon.png`,
    alt: 'Patient in wheelchair with assistant',
    linkTo: '/discharge' // Exemple de lien, à définir
  }
];

function HomePage({ currentUser }) {
  // Set the document title when the component mounts
  useEffect(() => {
    document.title = "MedAssist AI - Dashboard";
    // Optional: Reset the title when the component unmounts if needed
    // return () => {
    //   document.title = "MedAssist AI - Log in"; // Or your default title
    // };
  }, []); // Empty dependency array means this effect runs once on mount

  const heroStyle = {
    backgroundImage: `url(${heroBackgroundImage})`
  };

  return (
    <div className="homepage-container">
      <section className="hero-section" style={heroStyle}>
        <div className="hero-logo-container">
          <img 
            src={`${process.env.PUBLIC_URL}/home_page/MedAssistLogo.png`} 
            alt="MedAssist AI Logo" 
            className="hero-logo" 
          />
        </div>
        <h1 className="hero-title">MedAssist AI</h1>
      </section>

      <section className="services-section">
        <h2 className="services-title">Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <Link to={service.linkTo} key={service.id} className="service-card">
              <div className="service-card-icon-container">
                <img src={service.icon} alt={service.alt} className="service-icon" />
              </div>
              {service.title && <span className="service-card-title">{service.title}</span>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage; 