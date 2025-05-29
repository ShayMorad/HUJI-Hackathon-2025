import React, { useEffect, useState } from 'react';
import './PatientsStatusPage.css'; // CSS for this page
// Removed import { fetchPatients } from '../api/patientApi';

// Sample patient data - kept locally for now
const initialPatientsData = [
  {
    id: 1,
    room: '204 A',
    name: 'Alice Wonderland',
    reason: 'Routine Check-up Follow-up',
    status: 'pending', // yellow
  },
  {
    id: 2,
    room: '301 B',
    name: 'Bob The Builder',
    reason: 'Post-Surgery Observation',
    status: 'ready_to_discharge', // green
  },
  {
    id: 3,
    room: '105 C',
    name: 'Charlie Brown',
    reason: 'Critical Cardiac Condition',
    status: 'urgent', // red
  },
  // Add more patients as needed for scrolling example
  {
    id: 4,
    room: '208 A',
    name: 'Diana Prince',
    reason: 'Minor Fracture',
    status: 'pending', // yellow
  },
  {
    id: 5,
    room: '310 B',
    name: 'Edward Scissorhands',
    reason: 'Consultation',
    status: 'ready_to_discharge', // green
  },
  {
    id: 6,
    room: '404 D',
    name: 'Fiona Gallagher',
    reason: 'Flu Symptoms',
    status: 'pending',
  },
];

const statusTypes = ['urgent', 'ready_to_discharge', 'pending'];

// Helper to map status to a sort order and color class
const statusMap = {
  urgent: { order: 1, className: 'status-urgent' },
  ready_to_discharge: { order: 2, className: 'status-ready' },
  pending: { order: 3, className: 'status-pending' },
};

function PatientsStatusPage() {
  const [patients, setPatients] = useState([]);

  // Function to simulate updating and sorting patient data
  const simulateUpdateAndSortPatients = () => {
    console.log("Simulating patient data update...");
    // Create a deep copy to avoid modifying the original initialPatientsData directly if we base off it
    // Or, if we want changes to persist across simulations, we'd work on a stateful list
    let updatedPatients = JSON.parse(JSON.stringify(initialPatientsData)); // Start fresh or use current patients

    // Simulate a dynamic change: randomly change one patient's status
    if (updatedPatients.length > 0) {
      const randomIndex = Math.floor(Math.random() * updatedPatients.length);
      const randomStatusIndex = Math.floor(Math.random() * statusTypes.length);
      updatedPatients[randomIndex].status = statusTypes[randomStatusIndex];
      console.log(`Simulated: Patient ${updatedPatients[randomIndex].name} status changed to ${updatedPatients[randomIndex].status}`);
    }

    const sortedPatients = updatedPatients.sort((a, b) => {
      return statusMap[a.status].order - statusMap[b.status].order;
    });
    setPatients(sortedPatients);
  };

  useEffect(() => {
    document.title = "MedAssist AI - Patients Status";
    simulateUpdateAndSortPatients(); // Initial load with potential random change

    const intervalId = setInterval(() => {
      simulateUpdateAndSortPatients();
    }, 60000); // 60000 ms = 1 minute

    return () => {
      clearInterval(intervalId);
      console.log("Cleared patient list update interval.");
    };
  }, []);

  if (patients.length === 0) {
    return <div className="info-message-patients">Loading initial patient data or no patients to display...</div>;
  }

  return (
    <div className="patients-status-page-container">
      <div className="patients-list-sidebar">
        <h2>Patient Overview</h2>
        <div className="patients-table-scrollable">
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Name</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className={statusMap[patient.status].className}>
                  <td>{patient.room}</td>
                  <td>{patient.name}</td>
                  <td>{patient.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="main-content-area">
        <h1>Patient Details</h1>
        <p>Select a patient from the list to see more details here.</p>
        <p><em>Patient list updates every 1 minute (simulated).</em></p>
      </div>
    </div>
  );
}

export default PatientsStatusPage; 