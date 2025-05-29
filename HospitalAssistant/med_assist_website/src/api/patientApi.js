// This file will contain functions to interact with the backend patient API.

const API_BASE_URL = 'http://localhost:8000'; // IMPORTANT: Replace YOUR_BACKEND_PORT with your actual backend port

export const fetchPatients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hospital`); // Assuming your endpoint is /patients
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    throw error; 
  }
};

export const fetchPatientById = async (patientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`); // Assuming your endpoint is /patients/:id
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch patient ${patientId}:`, error);
    throw error;
  }
};

export const sendChatMessagePost = async (loggedInUser, selectedPatient, message) => {
  const payload = {
    userId: loggedInUser.username,
    userName: loggedInUser.name,
    patientId: selectedPatient.id,
    patientName: selectedPatient.name,
    message: message,
    timestamp: new Date().toISOString(),
  };

  const requestUrl = `${API_BASE_URL}/chat`; // Assuming your chat endpoint is /chat for POST requests

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to send chat message via POST:", error);
    throw error;
  }
};

// Add more functions as needed (e.g., createPatient, updatePatient, deletePatient) 