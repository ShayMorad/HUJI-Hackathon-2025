import React, { useEffect, useState, useRef } from 'react';
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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const simulateUpdateAndSortPatients = () => {
    console.log("Simulating patient data update...");
    let updatedPatientsSource = JSON.parse(JSON.stringify(initialPatientsData));

    // Simulate a patient being removed occasionally for testing this feature
    // This is a simple way; a more robust way would manage IDs
    if (Math.random() < 0.1 && updatedPatientsSource.length > 1 && selectedPatient) { // 10% chance to remove a patient IF one is selected
      const patientToRemoveIndex = updatedPatientsSource.findIndex(p => p.id === selectedPatient.id);
      if (patientToRemoveIndex !== -1) {
        console.log(`Simulating removal of selected patient: ${updatedPatientsSource[patientToRemoveIndex].name}`);
        updatedPatientsSource.splice(patientToRemoveIndex, 1);
      } else {
        // If selected patient not found (should not happen with this logic), remove another for demo
        const randomIdxToDrop = Math.floor(Math.random() * updatedPatientsSource.length);
        console.log(`Simulating removal of random patient: ${updatedPatientsSource[randomIdxToDrop].name}`);
        updatedPatientsSource.splice(randomIdxToDrop, 1); 
      }
    } else {
      // Simulate a dynamic status change if no patient was removed
      if (updatedPatientsSource.length > 0) {
        const randomIndex = Math.floor(Math.random() * updatedPatientsSource.length);
        const randomStatusIndex = Math.floor(Math.random() * statusTypes.length);
        updatedPatientsSource[randomIndex].status = statusTypes[randomStatusIndex];
      }
    }

    const sortedPatients = updatedPatientsSource.sort((a, b) => {
      return statusMap[a.status].order - statusMap[b.status].order;
    });
    setPatients(sortedPatients);

    // Check if the currently selected patient still exists in the new list
    if (selectedPatient) {
      const stillExists = sortedPatients.find(p => p.id === selectedPatient.id);
      if (!stillExists) {
        console.log(`Selected patient ${selectedPatient.name} no longer in list. Closing chat.`);
        setSelectedPatient(null);
        setChatMessages([]);
        setCurrentMessage('');
      }
    }
  };

  useEffect(() => {
    document.title = "MedAssist AI - Patients Status";
    simulateUpdateAndSortPatients();
    const intervalId = setInterval(simulateUpdateAndSortPatients, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setChatMessages([]);
    setCurrentMessage('');
    setTimeout(() => {
      setChatMessages([
        { id: Date.now(), text: `chat with AI assistant about ${patient.name} (Room: ${patient.room}).`, sender: 'system' }
      ]);
    }, 300);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === '' || !selectedPatient) return;

    const newMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
    };
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    setCurrentMessage('');

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `Backend received: "${newMessage.text}". (Simulated for ${selectedPatient.name})`,
        sender: 'bot',
      };
      setChatMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000 + Math.random() * 1000);
  };

  if (patients.length === 0 && !selectedPatient) {
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
                <tr 
                  key={patient.id} 
                  className={`${statusMap[patient.status].className} ${selectedPatient?.id === patient.id ? 'selected-patient-row' : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <td>{patient.room}</td>
                  <td>{patient.name}</td>
                  <td>{patient.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="main-content-area chat-area">
        {selectedPatient ? (
          <>
            <h3>Chat with AI assistant about {selectedPatient.name} (Room: {selectedPatient.room})</h3>
            <div className="chat-messages-container">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-message ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={chatMessagesEndRef} />
            </div>
            <div className="chat-input-area">
              <input 
                type="text" 
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <>
            <h1>Patient Details</h1>
            <p>Select a patient from the list to start a chat or see details.</p>
          </>
        )}
        <p style={{marginTop: '20px'}}><em>Patient list updates every 1 minute (simulated).</em></p>
      </div>

      <div className="actions-panel-area">
        <h3>Actions</h3>
        {/* Les boutons viendront ici */}
        <p><i>Future buttons area.</i></p>
      </div>
    </div>
  );
}

export default PatientsStatusPage; 