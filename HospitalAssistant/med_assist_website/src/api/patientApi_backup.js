// This file will contain functions to interact with the backend patient API.

const API_BASE_URL = 'http://localhost:8003'; // IMPORTANT: Replace YOUR_BACKEND_PORT with your actual backend port

export const fetchPatients = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/hospital`); // Assuming your endpoint is /patients
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const hospitalData = await response.json();
        const allPatients = [];

        if (hospitalData && hospitalData.wards) {
            hospitalData.wards.forEach(ward => {
                if (ward.patients) {
                    ward.patients.forEach(patient => {
                        const transformedStaff = patient.assigned_staff ? patient.assigned_staff.map(staffString => {
                            const match = staffString.match(/(.*)\s\((.*)\)/);
                            if (match && match[1] && match[2]) {
                                return {name: match[1].trim(), role: match[2].trim()};
                            }
                            return {name: staffString, role: 'Unknown'}; // Fallback
                        }) : [];

                        let mappedStatus = 'pending'; // Default status
                        if (patient.status) {
                          switch (patient.status.toLowerCase()) {
                            case 'stable':
                              mappedStatus = 'pending'; // Or another appropriate status like 'ready_to_discharge'
                              break;
                            // Add cases for other statuses your API might return
                            case 'critical':
                              mappedStatus = 'urgent';
                              break;
                            case 'ready for discharge':
                            mappedStatus = 'ready_to_discharge';
                            break;
                            default:
                              mappedStatus = 'pending';
                          }
                        }
                        // map any back-end status string → one of your three UI keys
                        // const BACKEND_STATUS_TO_UI = {
                        //     stable: 'pending',
                        //     unstable: 'urgent',
                        //     critical: 'urgent',
                        //     'ready for discharge': 'ready_to_discharge',
                        //     discharged: 'pending',
                        //     // …add more as needed
                        // };

                        export const fetchPatients = async () => {
                            // …
                            ward.patients.forEach(patient => {
                                const uiStatus = BACKEND_STATUS_TO_UI[
                                    patient.status.toLowerCase()
                                    ] || 'pending';   // default fallback

                                allPatients.push({
                                    id: patient.patient_id,
                                    name: patient.name,
                                    room: patient.room,
                                    reason: patient.reason,
                                    status: uiStatus,           // now guaranteed one of 'urgent'|'ready_to_discharge'|'pending'
                                    assignedStaff: transformedStaff
                                });
                            });
                            // …
                        };

                        allPatients.push({
                            id: patient.patient_id,
                            name: patient.name,
                            room: patient.room,
                            reason: patient.reason,
                            status: mappedStatus,
                            assignedStaff: transformedStaff,
                            // Include other fields if your frontend expects them from the patient object
                            // For example, age: patient.age if it exists and is needed directly
                        });
                    });
                }
            });
        }
        return allPatients;
    } catch (error) {
        console.error("Failed to fetch hospital/patient data:", error);
        throw error;
    }
};

// export const fetchPatientById = async (patientId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/patients/${patientId}`); // Assuming your endpoint is /patients/:id
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(`Failed to fetch patient ${patientId}:`, error);
//     throw error;
//   }
// };

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