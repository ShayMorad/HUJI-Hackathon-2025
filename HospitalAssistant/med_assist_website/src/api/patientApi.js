// This file will contain functions to interact with the backend patient API.

const API_BASE_URL = '/api'; // Adjust if your backend API is hosted elsewhere

// Example function to fetch all patients
export const fetchPatients = async () => {
  try {
    // In a real app, you would use fetch or a library like axios
    // const response = await fetch(`${API_BASE_URL}/patients`);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // const data = await response.json();
    // return data;

    // For now, returning mock data
    console.log('API CALL: fetchPatients');
    return new Promise(resolve => setTimeout(() => resolve([
      { id: 1, name: 'John Doe', age: 45, condition: 'Flu' },
      { id: 2, name: 'Jane Smith', age: 32, condition: 'Migraine' },
    ]), 500));
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw error; // Re-throw the error to be caught by the calling component
  }
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

// Add more functions as needed (e.g., createPatient, updatePatient, deletePatient) 