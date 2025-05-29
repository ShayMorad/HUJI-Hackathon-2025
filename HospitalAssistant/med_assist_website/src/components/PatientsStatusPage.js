import React, { useEffect, useState, useRef } from 'react';
import './PatientsStatusPage.css'; // CSS for this page
import { sendChatMessageGet } from '../api/patientApi'; // Import the new API function
import { processedInitialPatientsData, statusTypes, getRandomStaff } from '../data/patientData'; // Import data

// Helper to map status to a sort order and color class
const statusMap = {
  urgent: { order: 1, className: 'status-urgent' },
  ready_to_discharge: { order: 2, className: 'status-ready' },
  pending: { order: 3, className: 'status-pending' },
};

function PatientsStatusPage({ currentUser }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false); // For send button disabling
  const chatMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const simulateUpdateAndSortPatients = () => {
    console.log("Simulating patient data update...");
    // Use processedInitialPatientsData which ensures every patient has staff info
    let updatedPatientsSource = JSON.parse(JSON.stringify(processedInitialPatientsData));

    // Simulate a patient being removed occasionally for testing this feature

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
        // Optionally, simulate staff change too, though not requested
        // updatedPatientsSource[randomIndex].assignedStaff = getRandomStaff(Math.floor(Math.random() * 2) + 1);
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
    setChatMessages([
      { id: Date.now(), text: `Chat with AI assistant about ${patient.name} (Room: ${patient.room}). Assigned staff: ${(patient.assignedStaff || []).map(s => s.name + ' (' + s.role + ')').join(', ') || 'None'}.`, sender: 'system' }
    ]);
    setCurrentMessage("Please summarize the patient's chart.");
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() === '' || !selectedPatient || !currentUser || isSending) return;

    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
    };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsSending(true);

    try {
      // Actual API call (simulated for now)
      const response = await sendChatMessageGet(currentUser, selectedPatient, messageToSend);
      console.log("Simulated API response:", response);
      
      // Add the bot's reply from the simulated API response
      if (response && response.echo && response.echo.botReply) {
        const botMessage = {
          id: Date.now() + 1, // Ensure unique ID
          text: response.echo.botReply,
          sender: 'bot',
        };
        setChatMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        // Fallback if botReply is not in the expected format
        const fallbackBotMessage = {
            id: Date.now() +1,
            text: "Received, but couldn't process AI response this time (simulated).",
            sender: 'bot'
        };
        setChatMessages(prevMessages => [...prevMessages, fallbackBotMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message || 'Could not send message.'} (Simulated)`, 
        sender: 'system',
      };
      setChatMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false);
    }
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
      <div className="main-content-area">
        {selectedPatient ? (
          <>
            <div className="middle-top-content">
                
                {selectedPatient.assignedStaff && selectedPatient.assignedStaff.length > 0 ? (
                  <div className="assigned-staff-details">
                    <strong>Assigned Staff:</strong>
                    <ul>
                      {selectedPatient.assignedStaff.map(staff => (
                        <li key={staff.name}>{staff.name} ({staff.role})</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p style={{ color: 'orange', fontStyle: 'italic' }}>No assigned staff information to display for {selectedPatient.name} (either not present or empty).</p> 
                )}
            </div>

            <div className="chat-module-container">
                <h3>Chat with an AI assistant about {selectedPatient.name} (Room: {selectedPatient.room})</h3>
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
                        onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                        placeholder="Type your message..."
                        disabled={isSending}
                    />
                    <button onClick={handleSendMessage} disabled={isSending}>
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
          </>
        ) : (
          <div className="placeholder-content-centered">
            <h1>Patient Details & Chat</h1>
            <p>Select a patient from the list to start a chat or see details.</p>
          </div>
        )}
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