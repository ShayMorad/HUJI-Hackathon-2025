import React, {useEffect, useState, useRef} from 'react';
import './PatientsStatusPage.css'; // CSS for this page
import {sendChatMessagePost, fetchPatients} from '../api/patientApi'; // Updated import
// import { processedInitialPatientsData, statusTypes, getRandomStaff } from '../data/patientData'; // Commented out for now

// Helper to map status to a sort order and color class
const statusMap = {
    urgent: {order: 1, className: 'status-urgent'},
    ready_to_discharge: {order: 2, className: 'status-ready'},
    pending: {order: 3, className: 'status-pending'},
};

function PatientsStatusPage({currentUser}) {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isSending, setIsSending] = useState(false); // For send button disabling
    const chatMessagesEndRef = useRef(null);
    const [isLoadingPatients, setIsLoadingPatients] = useState(true); // For loading indicator
    const [errorLoadingPatients, setErrorLoadingPatients] = useState(null); // For error messages
    const [showVitals, setShowVitals] = useState(false); // Added for vitals display
    const [selectedPatientVitals, setSelectedPatientVitals] = useState(null); // Added for vitals data

    const handleActionButtonClick = (buttonName) => {
        if (buttonName === 'Vitals') {
            if (!selectedPatient) {
                alert("Please select a patient first to view their vitals.");
                return;
            }
            setShowVitals(prevShowVitals => {
                const newShowVitals = !prevShowVitals;
                if (newShowVitals) {
                    // Mock data for now, replace with actual API call later
                    setSelectedPatientVitals({
                        BP: {value: '120/80', unit: 'mmHg', trend: 'stable'},
                        HR: {value: '75', unit: 'bpm', trend: 'up'},
                        SpO2: {value: '98', unit: '%', trend: 'stable'},
                        // Add more vitals if needed, or make it dynamic from API
                    });
                } else {
                    setSelectedPatientVitals(null); // Clear vitals when hiding
                }
                return newShowVitals;
            });
        } else {
            alert(`${buttonName} feature doesn't work yet`);
        }
    };

    const scrollToBottom = () => {
        chatMessagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(scrollToBottom, [chatMessages]);

    // Commenting out simulateUpdateAndSortPatients as we will load from API
    /*
    const simulateUpdateAndSortPatients = () => {
      console.log("Simulating patient data update...");
      let updatedPatientsSource = JSON.parse(JSON.stringify(processedInitialPatientsData));

      if (Math.random() < 0.1 && updatedPatientsSource.length > 1 && selectedPatient) {
        const patientToRemoveIndex = updatedPatientsSource.findIndex(p => p.id === selectedPatient.id);
        if (patientToRemoveIndex !== -1) {
          console.log(`Simulating removal of selected patient: ${updatedPatientsSource[patientToRemoveIndex].name}`);
          updatedPatientsSource.splice(patientToRemoveIndex, 1);
        } else {
          const randomIdxToDrop = Math.floor(Math.random() * updatedPatientsSource.length);
          console.log(`Simulating removal of random patient: ${updatedPatientsSource[randomIdxToDrop].name}`);
          updatedPatientsSource.splice(randomIdxToDrop, 1);
        }
      } else {
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
    */

    useEffect(() => {
        document.title = "MedAssist AI - Patients Status";

        const loadPatients = async () => {
            try {
                setErrorLoadingPatients(null);
                setIsLoadingPatients(true);
                const fetchedPatients = await fetchPatients();
                // Sort patients by status order defined in statusMap
                const sortedFetchedPatients = fetchedPatients.sort((a, b) => {
                    const orderA = statusMap[a.status] ? statusMap[a.status].order : 99; // Fallback for unknown statuses
                    const orderB = statusMap[b.status] ? statusMap[b.status].order : 99;
                    return orderA - orderB;
                });
                setPatients(sortedFetchedPatients);
            } catch (error) {
                console.error("Error loading patients:", error);
                setErrorLoadingPatients(error.message || "Failed to load patient data.");
            } finally {
                setIsLoadingPatients(false);
            }
        };

        loadPatients();
        // If you want to refresh data periodically, you can set up an interval here
        // const intervalId = setInterval(loadPatients, 60000);
        // return () => clearInterval(intervalId);

    }, []); // Empty dependency array, run once on mount

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setChatMessages([
            {
                id: Date.now(),
                text: `Chat with AI assistant about ${patient.name} (Room: ${patient.room}). Assigned staff: ${(patient.assignedStaff || []).map(s => s.name + ' (' + s.role + ')').join(', ') || 'None'}.`,
                sender: 'system'
            }
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
            const response = await sendChatMessagePost(currentUser, selectedPatient, messageToSend);
            console.log("API response:", response);

            // if (response && response.echo && response.echo.botReply) {
            //   const botMessage = {
            //     id: Date.now() + 1,
            //     text: response.echo.botReply,
            //     sender: 'bot',
            //   };

            if (response && response.reply) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: response.reply,
                    sender: 'bot',
                };
                setChatMessages(prevMessages => [...prevMessages, botMessage]);
            } else {
                const fallbackBotMessage = {
                    id: Date.now() + 1,
                    text: "Received, but couldn't process AI response this time.",
                    sender: 'bot'
                };
                setChatMessages(prevMessages => [...prevMessages, fallbackBotMessage]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: `Error: ${error.message || 'Could not send message.'}`,
                sender: 'system',
            };
            setChatMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoadingPatients) {
        return <div className="info-message-patients">Loading patient data...</div>;
    }

    if (errorLoadingPatients) {
        return <div className="error-message-patients">Error: {errorLoadingPatients}</div>;
    }

    if (patients.length === 0 && !selectedPatient) {
        return <div className="info-message-patients">No patients to display.</div>;
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
                                className={`${(statusMap[patient.status] || {className: 'status-pending'}).className} ${selectedPatient?.id === patient.id ? 'selected-patient-row' : ''}`}
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
                                <p style={{color: 'orange', fontStyle: 'italic'}}>No assigned staff information to
                                    display for {selectedPatient.name} (either not present or empty).</p>
                            )}
                        </div>

                        <div className="chat-module-container">
                            <h3>Chat with an AI assistant
                                about {selectedPatient.name} (Room: {selectedPatient.room})</h3>
                            <div className="chat-messages-container">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                                <div ref={chatMessagesEndRef}/>
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
                <h3> Further actions </h3>
                <div className="action-buttons-container">
                    <button className="action-button" onClick={() => handleActionButtonClick('Medical Record')}>
                        <img src={`${process.env.PUBLIC_URL}/patient_status_page/medical_record_icone.jpg`}
                             alt="Medical Record"/>
                        <span>Medical Record</span>
                    </button>
                    <button className="action-button" onClick={() => handleActionButtonClick('Vitals')}>
                        <img src={`${process.env.PUBLIC_URL}/patient_status_page/vitals_icone.jpg`} alt="Vitals"/>
                        <span>Vitals</span>
                    </button>
                </div>
                {/* Vitals display section */}
                {showVitals && selectedPatient && selectedPatientVitals && (
                    <div className="vitals-display-container">
                        <h4>Vitals for {selectedPatient.name}</h4>
                        <div className="vitals-boxes">
                            <div className="vital-box">
                                <span className="vital-label">BP:</span>
                                <span
                                    className="vital-value">{selectedPatientVitals.BP.value} {selectedPatientVitals.BP.unit}</span>
                                <span className="vital-trend">(Trend: {selectedPatientVitals.BP.trend})</span>
                            </div>
                            <div className="vital-box">
                                <span className="vital-label">HR:</span>
                                <span
                                    className="vital-value">{selectedPatientVitals.HR.value} {selectedPatientVitals.HR.unit}</span>
                                <span className="vital-trend">(Trend: {selectedPatientVitals.HR.trend})</span>
                            </div>
                            <div className="vital-box">
                                <span className="vital-label">SpO2:</span>
                                <span
                                    className="vital-value">{selectedPatientVitals.SpO2.value} {selectedPatientVitals.SpO2.unit}</span>
                                <span className="vital-trend">(Trend: {selectedPatientVitals.SpO2.trend})</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientsStatusPage; 