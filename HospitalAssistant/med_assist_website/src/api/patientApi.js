// This file will contain functions to interact with the backend patient API.

const API_BASE_URL = '/api'; // Adjust if your backend API is hosted elsewhere

// Sample patient data with 9-digit IDs
const initialPatientsData = [
  {
    id: 123456789, // 9-digit ID
    room: '204 A',
    name: 'Alice Wonderland',
    reason: 'Routine Check-up Follow-up',
    status: 'pending', 
  },
  {
    id: 234567890, // 9-digit ID
    room: '301 B',
    name: 'Bob The Builder',
    reason: 'Post-Surgery Observation',
    status: 'ready_to_discharge',
  },
  {
    id: 345678901, // 9-digit ID
    room: '105 C',
    name: 'Charlie Brown',
    reason: 'Critical Cardiac Condition',
    status: 'urgent',
  },
  {
    id: 456789012, // 9-digit ID
    room: '208 A',
    name: 'Diana Prince',
    reason: 'Minor Fracture',
    status: 'pending',
  },
  {
    id: 567890123, // 9-digit ID
    room: '310 B',
    name: 'Edward Scissorhands',
    reason: 'Consultation',
    status: 'ready_to_discharge',
  },
  // Add a new patient to see updates over time in the mock
  {
    id: 678901234, // 9-digit ID
    room: '404 D',
    name: 'Fiona Gallagher',
    reason: 'Flu Symptoms',
    status: 'pending',
  },
];

// Function to simulate fetching patients from a backend
export const fetchPatients = async () => {
  console.log("Mock API: Fetching patients...");
  return new Promise((resolve) => {
    setTimeout(() => {
      // To simulate data changes, we can slightly alter the data each time
      // For now, let's just return a copy. Later, we could randomize a status.
      const data = JSON.parse(JSON.stringify(initialPatientsData));
      
      // Example of a slight data modification to simulate updates:
      // Randomly change a patient's status for demonstration
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const statuses = ['urgent', 'ready_to_discharge', 'pending'];
        const newStatusIndex = Math.floor(Math.random() * statuses.length);
        // data[randomIndex].status = statuses[newStatusIndex];
        // console.log(`Mock API: Updated patient ${data[randomIndex].name} to status ${data[randomIndex].status}`);
      }

      resolve(data);
    }, 500); // Simulate network delay
  });
};

// Example function to fetch a single patient by ID
export const fetchPatientById = async (patientId) => {
  try {
    // const response = await fetch(`${API_BASE_URL}/patients/${patientId}`);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    // return data;

    console.log(`API CALL: fetchPatientById, ID: ${patientId}`);
    return new Promise(resolve => setTimeout(() => resolve(
      { id: patientId, name: 'Mock Patient', age: 50, condition: 'Mock Condition' }
    ), 300));
  } catch (error) {
    console.error(`Failed to fetch patient ${patientId}:`, error);
    throw error;
  }
};

// Function to simulate sending a chat message via GET
export const sendChatMessageGet = async (loggedInUser, selectedPatient, message) => {
  // loggedInUser should have properties like 'username' (for ID) and 'name'
  // selectedPatient should have properties like 'id' (patient's ID) and 'name'
  const params = new URLSearchParams({
    userId: loggedInUser.username, // Using username as a unique ID for the logged-in user
    userName: loggedInUser.name,
    patientId: selectedPatient.id,
    patientName: selectedPatient.name,
    message: message,
    timestamp: new Date().toISOString(),
  });

  const queryString = params.toString();
  const requestUrl = `${API_BASE_URL}/chat?${queryString}`;

  console.log(`Mock API: Simulating GET request to: ${requestUrl}`);

  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful response or an error
      if (Math.random() > 0.1) { // 90% success rate for simulation
        console.log("Mock API: Message sent successfully via GET (simulated).");
        resolve({ 
          success: true, 
          message: "Message received by backend (simulated)", 
          echo: {
            originalMessage: message,
            processedAt: new Date().toISOString(),
            // The backend might return the bot's actual reply here
            botReply: `Backend acknowledges your message: \"${message}\" for patient ${selectedPatient.name}.`
          }
        });
      } else {
        console.error("Mock API: Failed to send message via GET (simulated error).");
        reject({ success: false, message: "Simulated backend error sending message." });
      }
    }, 700);
  });
};

// Add more functions as needed (e.g., createPatient, updatePatient, deletePatient) 