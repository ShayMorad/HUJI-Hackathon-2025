// This file will contain functions to interact with the backend appointment API.

const API_BASE_URL = '/api'; // Adjust if your backend API is hosted elsewhere

// Example function to fetch all appointments for a doctor
export const fetchAppointments = async (doctorId) => {
    try {
        // const response = await fetch(`${API_BASE_URL}/appointments?doctorId=${doctorId}`);
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        // return data;

        console.log(`API CALL: fetchAppointments for doctor ID: ${doctorId}`);
        return new Promise(resolve => setTimeout(() => resolve([
            {id: 101, patientName: 'John Doe', time: '2024-07-30T10:00:00', reason: 'Check-up'},
            {id: 102, patientName: 'Alice Wonderland', time: '2024-07-30T11:30:00', reason: 'Follow-up'},
        ]), 600));
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        throw error;
    }
};

// Example function to create a new appointment
export const createAppointment = async (appointmentData) => {
    try {
        // const response = await fetch(`${API_BASE_URL}/appointments`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(appointmentData),
        // });
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        // return data;

        console.log('API CALL: createAppointment', appointmentData);
        return new Promise(resolve => setTimeout(() => resolve(
            {...appointmentData, id: Math.floor(Math.random() * 1000) + 200, message: 'Appointment created'}
        ), 400));
    } catch (error) {
        console.error('Failed to create appointment:', error);
        throw error;
    }
};

// Add more functions as needed (e.g., updateAppointment, cancelAppointment) 