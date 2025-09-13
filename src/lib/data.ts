export const doctors = [
  {
    id: '1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Cardiologist',
    avatar: 'doctor-1',
    availability: [
      { day: 'Monday', time: '10:00 AM - 1:00 PM' },
      { day: 'Wednesday', time: '2:00 PM - 5:00 PM' },
      { day: 'Friday', time: '9:00 AM - 12:00 PM' },
    ],
  },
  {
    id: '2',
    name: 'Dr. Raj Patel',
    specialty: 'Dermatologist',
    avatar: 'doctor-2',
    availability: [
      { day: 'Tuesday', time: '9:00 AM - 12:00 PM' },
      { day: 'Thursday', time: '1:00 PM - 4:00 PM' },
    ],
  },
  {
    id: '3',
    name: 'Dr. Priya Singh',
    specialty: 'Pediatrician',
    avatar: 'doctor-3',
    availability: [
      { day: 'Monday', time: '9:00 AM - 5:00 PM' },
      { day: 'Tuesday', time: '9:00 AM - 5:00 PM' },
      { day: 'Wednesday', time: '9:00 AM - 1:00 PM' },
    ],
  },
  {
    id: '4',
    name: 'Dr. Sameer Khan',
    specialty: 'General Physician',
    avatar: 'doctor-4',
    availability: [
      { day: 'Monday', time: '2:00 PM - 6:00 PM' },
      { day: 'Wednesday', time: '9:00 AM - 1:00 PM' },
      { day: 'Friday', time: '2:00 PM - 6:00 PM' },
    ],
  },
];

export const appointments = [
    { id: 'apt1', patient: 'Rohan Kumar', doctor: 'Dr. Anjali Sharma', time: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 30), status: 'Confirmed' },
    { id: 'apt2', patient: 'Sunita Devi', doctor: 'Dr. Raj Patel', time: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 0), status: 'Confirmed' },
    { id: 'apt3', patient: 'Amit Verma', doctor: 'Dr. Priya Singh', time: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(9, 0), status: 'Pending' },
];
