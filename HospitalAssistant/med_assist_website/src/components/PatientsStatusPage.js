import React, { useEffect, useState, useRef } from 'react';
import './PatientsStatusPage.css'; // CSS for this page
import { sendChatMessageGet } from '../api/patientApi'; // Import the new API function

// Fictional medical staff list
const medicalStaffPool = [
  { name: 'Dr. Emily Carter', role: 'Cardiologist' },
  { name: 'Dr. Johnathan Lee', role: 'Neurologist' },
  { name: 'Nurse Olivia White', role: 'Head Nurse' },
  { name: 'Nurse Ben Green', role: 'Registered Nurse' },
  { name: 'Dr. Ken Adams', role: 'Oncologist' },
  { name: 'Therapist Laura Hill', role: 'Physical Therapist' },
  { name: 'Dr. Sarah Evans', role: 'Pediatrician' },
  { name: 'Nurse Tom Clark', role: 'Surgical Nurse' },
  { name: 'Dr. Aisha Khan', role: 'General Physician' },
  { name: 'Radiologist Mike Bell', role: 'Radiologist' }
];

// Helper function to get random staff for a patient
const getRandomStaff = (numStaff = 2) => {
  const shuffled = [...medicalStaffPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * numStaff) + 1); // Assign 1 to numStaff members
};

// Sample patient data - kept locally for now, with 9-digit IDs
const initialPatientsData = [
  {
    id: 123456789,
    room: '204 A',
    name: 'Alice Wonderland',
    reason: 'Routine Check-up Follow-up',
    status: 'pending', // yellow
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 234567890,
    room: '301 B',
    name: 'Bob The Builder',
    reason: 'Post-Surgery Observation',
    status: 'ready_to_discharge', // green
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 345678901,
    room: '105 C',
    name: 'Charlie Brown',
    reason: 'Critical Cardiac Condition',
    status: 'urgent', // red
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 456789012,
    room: '208 A',
    name: 'Diana Prince',
    reason: 'Minor Fracture',
    status: 'pending', // yellow
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 567890123,
    room: '310 B',
    name: 'Edward Scissorhands',
    reason: 'Consultation',
    status: 'ready_to_discharge', // green
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 678901234,
    room: '404 D',
    name: 'Fiona Gallagher',
    reason: 'Flu Symptoms',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  // Start of 52 new patients (with staff)
  {
    id: 700000001,
    room: '101 A',
    name: 'John Smith',
    reason: 'Pre-Surgery Evaluation',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000002,
    room: '102 B',
    name: 'Maria Garcia',
    reason: 'Allergy Testing',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000003,
    room: '103 C',
    name: 'David Lee',
    reason: 'Physical Therapy',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000004,
    room: '104 D',
    name: 'Sarah Jones',
    reason: 'Pain Management',
    status: 'urgent',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000005,
    room: '105 A',
    name: 'Michael Brown',
    reason: 'Diagnostic Imaging',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000006,
    room: '201 B',
    name: 'Linda Davis',
    reason: 'Diabetes Management',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000007,
    room: '202 C',
    name: 'James Wilson',
    reason: 'Sleep Study',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000008,
    room: '203 D',
    name: 'Patricia Miller',
    reason: 'Cardiac Stress Test',
    status: 'urgent',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000009,
    room: '204 A',
    name: 'Robert Moore',
    reason: 'Nutritional Counseling',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000010,
    room: '301 B',
    name: 'Jennifer Taylor',
    reason: 'Respiratory Therapy',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000011,
    room: '302 C',
    name: 'William Anderson',
    reason: 'Wound Care',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000012,
    room: '303 D',
    name: 'Elizabeth Thomas',
    reason: 'Post-Operative Checkup',
    status: 'urgent',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000013,
    room: '304 A',
    name: 'Richard Jackson',
    reason: 'Blood Work',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000014,
    room: '401 B',
    name: 'Susan White',
    reason: 'Neurological Exam',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000015,
    room: '402 C',
    name: 'Joseph Harris',
    reason: 'Chemotherapy Session',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000016,
    room: '403 D',
    name: 'Karen Martin',
    reason: 'Mental Health Evaluation',
    status: 'urgent',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000017,
    room: '110 A',
    name: 'Charles Thompson',
    reason: 'Vaccination',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000018,
    room: '111 B',
    name: 'Jessica Garcia',
    reason: 'Infection Treatment',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000019,
    room: '112 C',
    name: 'Thomas Martinez',
    reason: 'Broken Bone Setting',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000020,
    room: '113 D',
    name: 'Nancy Robinson',
    reason: 'Ongoing Monitoring',
    status: 'urgent',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000021,
    room: '210 A',
    name: 'Daniel Clark',
    reason: 'Specialist Consultation',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000022,
    room: '211 B',
    name: 'Laura Rodriguez',
    reason: 'Maternity Checkup',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000023,
    room: '212 C',
    name: 'Paul Lewis',
    reason: 'Emergency Room Follow-up',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000024,
    room: '213 D',
    name: 'Betty Walker',
    reason: 'Heart Monitoring',
    status: 'urgent',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000025,
    room: '310 A',
    name: 'Mark Hall',
    reason: 'Annual Physical',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000026,
    room: '311 B',
    name: 'Helen Allen',
    reason: 'Digestive Issues',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000027,
    room: '312 C',
    name: 'Steven Young',
    reason: 'Kidney Function Test',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000028,
    room: '313 D',
    name: 'Donna King',
    reason: 'Chronic Pain Assessment',
    status: 'urgent',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000029,
    room: '410 A',
    name: 'Kevin Wright',
    reason: 'Pulmonary Function Test',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000030,
    room: '411 B',
    name: 'Sandra Scott',
    reason: 'Skin Condition Check',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000031,
    room: '412 C',
    name: 'George Green',
    reason: 'Vision Test',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000032,
    room: '413 D',
    name: 'Deborah Adams',
    reason: 'Post-Stroke Care',
    status: 'urgent',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000033,
    room: '115 A',
    name: 'Brian Baker',
    reason: 'Hearing Test',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000034,
    room: '116 B',
    name: 'Kimberly Nelson',
    reason: 'Medication Adjustment',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000035,
    room: '117 C',
    name: 'Jason Carter',
    reason: 'Recovery Monitoring',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000036,
    room: '118 D',
    name: 'Cynthia Mitchell',
    reason: 'Urgent Consultation',
    status: 'urgent',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000037,
    room: '215 A',
    name: 'Matthew Perez',
    reason: 'Orthopedic Follow-up',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000038,
    room: '216 B',
    name: 'Angela Roberts',
    reason: 'Endoscopy',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000039,
    room: '217 C',
    name: 'Larry Turner',
    reason: 'Biopsy Follow-up',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000040,
    room: '218 D',
    name: 'Brenda Phillips',
    reason: 'Intensive Care Follow-up',
    status: 'urgent',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000041,
    room: '315 A',
    name: 'Justin Campbell',
    reason: 'ENT Checkup',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000042,
    room: '316 B',
    name: 'Amy Parker',
    reason: 'Geriatric Assessment',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000043,
    room: '317 C',
    name: 'Frank Evans',
    reason: 'Rehabilitation Progress Check',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000044,
    room: '318 D',
    name: 'Melissa Edwards',
    reason: 'High-Risk Pregnancy Monitoring',
    status: 'urgent',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000045,
    room: '415 A',
    name: 'Scott Collins',
    reason: 'Pre-Travel Health Check',
    status: 'pending',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000046,
    room: '416 B',
    name: 'Rebecca Stewart',
    reason: 'Mental Wellness Check-in',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000047,
    room: '417 C',
    name: 'Jerry Morris',
    reason: 'Final Discharge Review',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000048,
    room: '418 D',
    name: 'Janet Rogers',
    reason: 'Acute Allergic Reaction Follow-up',
    status: 'urgent',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000049,
    room: '120 A',
    name: 'Walter Reed',
    reason: 'Gastrointestinal Distress',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 700000050,
    room: '121 B',
    name: 'Evelyn Cook',
    reason: 'Cognitive Assessment',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 700000051,
    room: '122 C',
    name: 'Arthur Morgan',
    reason: 'Dermatology Consultation',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(1)
  },
  {
    id: 700000052,
    room: '123 D',
    name: 'Virginia Bailey',
    reason: 'Respiratory Infection',
    status: 'urgent',
    assignedStaff: getRandomStaff(2)
  }
];

// Ensure all 50+ patients have the assignedStaff field.
// This is a simplified way to show the transformation.
// In a real scenario, a script would iterate through the existing data to add this.
const allPatientsWithStaff = initialPatientsData.map(patient => ({
    ...patient,
    // If assignedStaff is somehow missed for some, add a default random assignment
    assignedStaff: patient.assignedStaff || getRandomStaff(Math.floor(Math.random() * 2) + 1) 
})); 

const statusTypes = ['urgent', 'ready_to_discharge', 'pending'];

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
    // Use allPatientsWithStaff which ensures every patient has staff info
    let updatedPatientsSource = JSON.parse(JSON.stringify(allPatientsWithStaff));

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
                <h4>Patient Information Area (Future Content)</h4>
                <p>Details about {selectedPatient.name} could go here.</p>
                
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