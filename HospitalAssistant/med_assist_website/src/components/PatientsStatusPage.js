import React, {useEffect, useState, useRef} from 'react';
import './PatientsStatusPage.css'; // <-- Assurez-vous que cette ligne est bien présente et pointe vers le bon fichier CSS
import {sendChatMessagePost, fetchPatients, fetchPatientById} from '../api/patientApi';
import VisualCharts from './VitalsCharts';
// Helper to map status to a sort order and color class
const statusMap = {
    urgent: {order: 1, className: 'status-urgent'},
    ready_to_discharge: {order: 2, className: 'status-ready'},
    pending: {order: 3, className: 'status-pending'},
};

// Composant PatientMedicalSummary refactorisé
function PatientMedicalSummary({patientInfo, isLoading, error}) {
    if (isLoading) {
        return <div className="medical-summary-info">Loading patient overview...</div>;
    }

    if (error) {
        return <div className="medical-summary-error">Error loading patient overview: {error}</div>;
    }

    if (!patientInfo) {
        return <div className="medical-summary-info">No patient overview available.</div>;
    }

    const {
        age = 'N/A',
        preferred_language: preferredLanguage = 'N/A',
        risk_score: riskScore = 'N/A',
        social_profile: socialProfile = {},
        allergies = [],
        medications = [],
        conditions = []
    } = patientInfo;

    const {
        living_situation: livingSituation = 'N/A',
        caregiver_available: caregiverAvailable,
        home_address: homeAddress = 'N/A',
        support_contacts: supportContacts = []
    } = socialProfile;

    return (
        <div className="medical-summary-container">
            <h3>Patient Overview</h3>

            <div className="summary-section">
                <div className="summary-line">
                    <span className="summary-label">Age: </span>
                    <span className="summary-value">{age}</span>
                </div>
                <div className="summary-line">
                    <span className="summary-label">Preferred Language: </span>
                    <span className="summary-value">{preferredLanguage}</span>
                </div>
                <div className="summary-line">
                    <span className="summary-label">Risk Score: </span>
                    <span
                        className="summary-value">{typeof riskScore === 'number' ? riskScore.toFixed(2) : riskScore}</span>
                </div>
            </div>

            <h4>Social Profile:</h4>
            <div className="summary-section">
                <div className="summary-line">
                    <span className="summary-label">Living Situation: </span>
                    <span className="summary-value">{livingSituation}</span>
                </div>
                <div className="summary-line">
                    <span className="summary-label">Caregiver Available: </span>
                    <span
                        className="summary-value">{caregiverAvailable === true ? 'Yes' : caregiverAvailable === false ? 'No' : 'N/A'}</span>
                </div>
                <div className="summary-line">
                    <span className="summary-label">Home Address: </span>
                    <span className="summary-value">{homeAddress}</span>
                </div>
                {supportContacts.length > 0 ? (
                    <>
                        <div className="summary-line">
                            <span className="summary-label">Support Contacts: </span>
                        </div>
                        <ul className="summary-list">
                            {supportContacts.map((contact, index) => (
                                <li key={index}
                                    className="summary-list-item">{contact.name} ({contact.relationship}): {contact.phone}</li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="summary-line">
                        <span className="summary-label">Support Contacts: </span>
                        <span className="summary-value">No contacts listed.</span>
                    </div>
                )}
            </div>

            {/* Placeholder sections for medical data */}
            <h4>Allergies:</h4>
            <div className="summary-section">
                {allergies.length > 0 ? (
                    <ul className="summary-list">
                        {allergies.map((allergy, index) => (
                            <li key={index} className="summary-list-item">{allergy}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="summary-line">
                        <span className="summary-value">No known allergies.</span>
                    </div>
                )}
            </div>

            <h4>Current Medications:</h4>
            <div className="summary-section">
                {medications.length > 0 ? (
                    <ul className="summary-list">
                        {medications.map((med, index) => (
                            <li key={index} className="summary-list-item">{med}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="summary-line">
                        <span className="summary-value">No current medications.</span>
                    </div>
                )}
            </div>

            <h4>Medical Conditions:</h4>
            <div className="summary-section">
                {conditions.length > 0 ? (
                    <ul className="summary-list">
                        {conditions.map((condition, index) => (
                            <li key={index} className="summary-list-item">{condition}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="summary-line">
                        <span className="summary-value">No medical conditions listed.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Le reste du composant PatientsStatusPage
function PatientsStatusPage({currentUser}) {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatMessagesEndRef = useRef(null);
    const [isLoadingPatients, setIsLoadingPatients] = useState(true);
    const [errorLoadingPatients, setErrorLoadingPatients] = useState(null); // <-- CORRECTION ICI
    const [showVitals, setShowVitals] = useState(false);
    const [selectedPatientVitals, setSelectedPatientVitals] = useState(null);

    const [showMedicalRecordSummary, setShowMedicalRecordSummary] = useState(false);
    const [patientMedicalData, setPatientMedicalData] = useState(null);
    const [isLoadingMedicalData, setIsLoadingMedicalData] = useState(false);
    const [errorMedicalData, setErrorMedicalData] = useState(null);

    useEffect(() => {
        const getMedicalData = async () => {
            if (showMedicalRecordSummary && selectedPatient) {
                setIsLoadingMedicalData(true);
                setErrorMedicalData(null);
                setPatientMedicalData(null);
                try {
                    const data = await fetchPatientById(selectedPatient.id);
                    setPatientMedicalData(data);
                } catch (error) {
                    setErrorMedicalData(error.message || "Failed to load medical record.");
                } finally {
                    setIsLoadingMedicalData(false);
                }
            } else if (!showMedicalRecordSummary) {
                setPatientMedicalData(null);
                setErrorMedicalData(null);
                setIsLoadingMedicalData(false);
            }
        };

        getMedicalData();
    }, [showMedicalRecordSummary, selectedPatient]);

    const handleActionButtonClick = (buttonName) => {
        if (buttonName === 'Medical Record') {
            if (!selectedPatient) {
                alert("Please select a patient first to view their medical record.");
                return;
            }
            setShowMedicalRecordSummary(prev => !prev);
            setShowVitals(false);
        } else if (buttonName === 'Vitals') {
            if (!selectedPatient) {
                alert("Please select a patient first to view their vitals.");
                return;
            }
            setShowVitals(prevShowVitals => {
                const newShowVitals = !prevShowVitals;
                if (newShowVitals) {
                    setSelectedPatientVitals({
                        BP: {value: '120/80', unit: 'mmHg', trend: 'stable'},
                        HR: {value: '75', unit: 'bpm', trend: 'up'},
                        SpO2: {value: '98', unit: '%', trend: 'stable'},
                    });
                } else {
                    setSelectedPatientVitals(null);
                }
                setShowMedicalRecordSummary(false);
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

    useEffect(() => {
        document.title = "MedAssist AI - Patients Status";

        const loadPatients = async () => {
            try {
                setErrorLoadingPatients(null);
                setIsLoadingPatients(true);
                const fetchedPatients = await fetchPatients();
                const sortedFetchedPatients = fetchedPatients.sort((a, b) => {
                    const orderA = statusMap[a.status] ? statusMap[a.status].order : 99;
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

        const intervalId = setInterval(() => {
            const isInputFocused = document.activeElement.tagName === 'INPUT';
            const isChatting = !!selectedPatient;

            if (!isChatting && !isInputFocused) {
                loadPatients();
            }
        }, 15000);

        return () => clearInterval(intervalId);

    }, []);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowMedicalRecordSummary(false);
        setShowVitals(false);
        setChatMessages([
            {
                id: Date.now(),
                text: `Chat with AI assistant about ${patient.name} (Room: ${patient.room}). Assigned staff: ${(patient.assignedStaff || []).map(s => s.name + ' (' + s.role + ')').join(', ') || 'None'}.`,
                sender: 'system'
            }
        ]);
        setCurrentMessage("What's the patient's vitals, information and clinical summary?");
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
                <h2 style={{backgroundColor: '#f0f0f0', color: '#003b5e'}}>Patient Overview</h2>
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
                                    <strong style={{fontSize: '2em', paddingLeft: '70px', color: '#003b5e'}}>Assigned
                                        Staff:</strong>
                                    <ul>
                                        {selectedPatient.assignedStaff.map(staff => (
                                            <ol style={{fontSize: '1.8em', textDecoration: 'underline'}}
                                                key={staff.name}>{staff.name} ({staff.role})</ol>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p style={{color: 'orange', fontStyle: 'italic'}}>No assigned staff information to
                                    display for {selectedPatient.name} (either not present or empty).</p>
                            )}
                        </div>

                        <div className="chat-module-container">
                            <h3 style={{fontSize: '1.8em', backgroundColor: '#f0f0f0', color: '#003b5e'}}>Chat with an
                                AI assistant
                                about {selectedPatient.name} (Room: {selectedPatient.room})</h3>
                            <div className="chat-messages-container">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                                        <p style={{fontSize: '1.2em'}}>{msg.text}</p>
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
                <h3 style={{fontSize: '1.8em', backgroundColor: '#f0f0f0', color: '#003b5e'}}> Further actions </h3>
                <div className="action-buttons-container">
                    <button className="action-button" onClick={() => handleActionButtonClick('Medical Record')}>
                        <img src={`${process.env.PUBLIC_URL}/patient_status_page/medical_record_icone.jpg`}
                             alt="Medical Record"/>
                        <span>Medical Record</span>
                    </button>
                    {showMedicalRecordSummary && selectedPatient && (
                        <PatientMedicalSummary
                            patientInfo={patientMedicalData}
                            isLoading={isLoadingMedicalData}
                            error={errorMedicalData}
                        />
                    )}

                    <button className="action-button" onClick={() => handleActionButtonClick('Vitals')}>
                        <img src={`${process.env.PUBLIC_URL}/patient_status_page/vitals_icone.jpg`} alt="Vitals"/>
                        <span>Vitals</span>
                    </button>
                </div>
                                {showVitals && selectedPatient && selectedPatientVitals && (
                    <div className="vitals-display-container">
                        <h4>Vitals for {selectedPatient.name}</h4>

                        {/* live mini-plots */}
                        <VisualCharts
                            bpSys={Number(selectedPatientVitals.BP.value.split('/')[0])}  // e.g. 120
                            hr={Number(selectedPatientVitals.HR.value)}                   // e.g. 75
                            spo2={Number(selectedPatientVitals.SpO2.value)}               // e.g. 98
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientsStatusPage;