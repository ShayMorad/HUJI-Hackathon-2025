export const medicalStaffPool = [
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

export const getRandomStaff = (numStaff = 2) => {
  const shuffled = [...medicalStaffPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * numStaff) + 1); 
};

const initialPatientsData = [
  {
    id: 123456789,
    room: '204 A',
    name: 'Alice Wonderland',
    reason: 'Routine Check-up Follow-up',
    status: 'pending',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 234567890,
    room: '301 B',
    name: 'Bob The Builder',
    reason: 'Post-Surgery Observation',
    status: 'ready_to_discharge',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 345678901,
    room: '105 C',
    name: 'Charlie Brown',
    reason: 'Critical Cardiac Condition',
    status: 'urgent',
    assignedStaff: getRandomStaff(3)
  },
  {
    id: 456789012,
    room: '208 A',
    name: 'Diana Prince',
    reason: 'Minor Fracture',
    status: 'pending',
    assignedStaff: getRandomStaff(2)
  },
  {
    id: 567890123,
    room: '310 B',
    name: 'Edward Scissorhands',
    reason: 'Consultation',
    status: 'ready_to_discharge',
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

export const processedInitialPatientsData = initialPatientsData.map(patient => ({
    ...patient,
    assignedStaff: patient.assignedStaff || getRandomStaff(Math.floor(Math.random() * 2) + 1) 
})); 

export const statusTypes = ['urgent', 'ready_to_discharge', 'pending']; 