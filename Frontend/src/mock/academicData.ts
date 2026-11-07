/**
 * FutureSchool - Central Academic Mock Data & Models
 */

export interface TimetablePeriod {
  id: string;
  period: number;
  periodNo?: number;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  time?: string;
  isBreak?: boolean;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'ACADEMIC' | 'EXAMINATION' | 'HOLIDAY' | 'SPORTS' | 'GENERAL';
  publishDate: string;
  author: string;
  department: string;
  isUrgent?: boolean;
  content: string;
  attachmentName?: string;
}

export interface ExamScore {
  subject: string;
  code: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  classAverage: number;
  highestInClass: number;
  remarks: string;
}

export interface AttendanceDayLog {
  day: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HOLIDAY' | 'WEEKEND';
  morningCheckIn?: string;
  afternoonCheckOut?: string;
  remarks?: string;
}

export const TIMETABLE_DATA: Record<string, TimetablePeriod[]> = {
  Monday: [
    { id: 'm1', period: 1, subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304', startTime: '08:30', endTime: '09:20' },
    { id: 'm2', period: 2, subject: 'Physics', teacher: 'Dr. Michael Chen', room: 'Lab 2', startTime: '09:25', endTime: '10:15' },
    { id: 'mb', period: 0, subject: 'Morning Interval / Refreshment', teacher: 'Staff', room: 'Cafeteria', startTime: '10:15', endTime: '10:35', isBreak: true },
    { id: 'm3', period: 3, subject: 'Chemistry', teacher: 'Dr. Emily Watson', room: 'Lab 1', startTime: '10:35', endTime: '11:25' },
    { id: 'm4', period: 4, subject: 'English Literature', teacher: 'Ms. Clara Oswald', room: 'Room 304', startTime: '11:30', endTime: '12:20' },
    { id: 'ml', period: 0, subject: 'Lunch Recess', teacher: 'Staff', room: 'Dining Hall', startTime: '12:20', endTime: '13:00', isBreak: true },
    { id: 'm5', period: 5, subject: 'Computer Science', teacher: 'Mr. Alan Turing', room: 'CS Lab', startTime: '13:00', endTime: '13:50' },
    { id: 'm6', period: 6, subject: 'Physical Education', teacher: 'Coach Briggs', room: 'Ground 1', startTime: '13:55', endTime: '14:45' }
  ],
  Tuesday: [
    { id: 't1', period: 1, subject: 'Chemistry', teacher: 'Dr. Emily Watson', room: 'Lab 1', startTime: '08:30', endTime: '09:20' },
    { id: 't2', period: 2, subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304', startTime: '09:25', endTime: '10:15' },
    { id: 'tb', period: 0, subject: 'Morning Interval', teacher: 'Staff', room: 'Cafeteria', startTime: '10:15', endTime: '10:35', isBreak: true },
    { id: 't3', period: 3, subject: 'Biology', teacher: 'Dr. Gregor Mendel', room: 'Bio Lab', startTime: '10:35', endTime: '11:25' },
    { id: 't4', period: 4, subject: 'Social Studies', teacher: 'Mr. Howard Zinn', room: 'Room 304', startTime: '11:30', endTime: '12:20' },
    { id: 'tl', period: 0, subject: 'Lunch Recess', teacher: 'Staff', room: 'Dining Hall', startTime: '12:20', endTime: '13:00', isBreak: true },
    { id: 't5', period: 5, subject: 'Hindi / Regional', teacher: 'Mrs. Sunita Rao', room: 'Room 304', startTime: '13:00', endTime: '13:50' },
    { id: 't6', period: 6, subject: 'Library & Research', teacher: 'Librarian Vance', room: 'Central Library', startTime: '13:55', endTime: '14:45' }
  ],
  Wednesday: [
    { id: 'w1', period: 1, subject: 'Physics', teacher: 'Dr. Michael Chen', room: 'Lab 2', startTime: '08:30', endTime: '09:20' },
    { id: 'w2', period: 2, subject: 'English Language', teacher: 'Ms. Clara Oswald', room: 'Room 304', startTime: '09:25', endTime: '10:15' },
    { id: 'wb', period: 0, subject: 'Morning Interval', teacher: 'Staff', room: 'Cafeteria', startTime: '10:15', endTime: '10:35', isBreak: true },
    { id: 'w3', period: 3, subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304', startTime: '10:35', endTime: '11:25' },
    { id: 'w4', period: 4, subject: 'Environmental Studies', teacher: 'Dr. Rachel Carson', room: 'Room 304', startTime: '11:30', endTime: '12:20' },
    { id: 'wl', period: 0, subject: 'Lunch Recess', teacher: 'Staff', room: 'Dining Hall', startTime: '12:20', endTime: '13:00', isBreak: true },
    { id: 'w5', period: 5, subject: 'Art & Design', teacher: 'Mr. Pablo Diaz', room: 'Studio 1', startTime: '13:00', endTime: '13:50' },
    { id: 'w6', period: 6, subject: 'Robotics Workshop', teacher: 'Mr. Alan Turing', room: 'Makerspace', startTime: '13:55', endTime: '14:45' }
  ],
  Thursday: [
    { id: 'th1', period: 1, subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304', startTime: '08:30', endTime: '09:20' },
    { id: 'th2', period: 2, subject: 'Social Studies', teacher: 'Mr. Howard Zinn', room: 'Room 304', startTime: '09:25', endTime: '10:15' },
    { id: 'thb', period: 0, subject: 'Morning Interval', teacher: 'Staff', room: 'Cafeteria', startTime: '10:15', endTime: '10:35', isBreak: true },
    { id: 'th3', period: 3, subject: 'Computer Science', teacher: 'Mr. Alan Turing', room: 'CS Lab', startTime: '10:35', endTime: '11:25' },
    { id: 'th4', period: 4, subject: 'Physics', teacher: 'Dr. Michael Chen', room: 'Lab 2', startTime: '11:30', endTime: '12:20' },
    { id: 'thl', period: 0, subject: 'Lunch Recess', teacher: 'Staff', room: 'Dining Hall', startTime: '12:20', endTime: '13:00', isBreak: true },
    { id: 'th5', period: 5, subject: 'Biology', teacher: 'Dr. Gregor Mendel', room: 'Bio Lab', startTime: '13:00', endTime: '13:50' },
    { id: 'th6', period: 6, subject: 'Music & Choir', teacher: 'Ms. Clara Oswald', room: 'Music Hall', startTime: '13:55', endTime: '14:45' }
  ],
  Friday: [
    { id: 'f1', period: 1, subject: 'Chemistry', teacher: 'Dr. Emily Watson', room: 'Lab 1', startTime: '08:30', endTime: '09:20' },
    { id: 'f2', period: 2, subject: 'English Literature', teacher: 'Ms. Clara Oswald', room: 'Room 304', startTime: '09:25', endTime: '10:15' },
    { id: 'fb', period: 0, subject: 'Morning Interval', teacher: 'Staff', room: 'Cafeteria', startTime: '10:15', endTime: '10:35', isBreak: true },
    { id: 'f3', period: 3, subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304', startTime: '10:35', endTime: '11:25' },
    { id: 'f4', period: 4, subject: 'Physical Education', teacher: 'Coach Briggs', room: 'Ground 1', startTime: '11:30', endTime: '12:20' },
    { id: 'fl', period: 0, subject: 'Lunch Recess', teacher: 'Staff', room: 'Dining Hall', startTime: '12:20', endTime: '13:00', isBreak: true },
    { id: 'f5', period: 5, subject: 'Hindi / Regional', teacher: 'Mrs. Sunita Rao', room: 'Room 304', startTime: '13:00', endTime: '13:50' },
    { id: 'f6', period: 6, subject: 'Physics Seminar', teacher: 'Dr. Michael Chen', room: 'Auditorium West', startTime: '13:55', endTime: '14:45' }
  ],
  Saturday: [
    { id: 's1', period: 1, subject: 'Club Activity / Debate', teacher: 'Faculty Panel', room: 'Club Rooms', startTime: '08:30', endTime: '09:20' },
    { id: 's2', period: 2, subject: 'Mathematics Remedial', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304', startTime: '09:25', endTime: '10:15' },
    { id: 'sb', period: 0, subject: 'Morning Break', teacher: 'Staff', room: 'Cafeteria', startTime: '10:15', endTime: '10:35', isBreak: true },
    { id: 's3', period: 3, subject: 'Physical Conditioning', teacher: 'Coach Briggs', room: 'Gymnasium', startTime: '10:35', endTime: '11:25' },
    { id: 's4', period: 4, subject: 'House Assemblies', teacher: 'House Mentors', room: 'Central Quadrangle', startTime: '11:30', endTime: '12:20' }
  ]
};

export const STUDENT_PROFILE = {
  id: 'GVS-2027-0001',
  admissionNumber: 'ADM-2021-0842',
  name: 'Aarav Sharma',
  grade: '10',
  section: 'A',
  rollNumber: 18,
  dateOfBirth: '14 May 2011',
  gender: 'Male',
  bloodGroup: 'O+ Positive',
  academicYear: '2026-2027',
  house: 'Emerald Falcon (Green House)',
  schoolName: 'Greenwood Valley School',
  curriculum: 'State Board of Secondary Education (SSC Board)',
  email: 'sharma.family@gvs.edu',
  phone: '+91 98450 12345',
  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=c0aede',
  father: {
    name: 'Dr. Rajesh Sharma',
    occupation: 'Senior Consultant Physician',
    phone: '+91 98450 12345',
    email: 'dr.sharma@healthcenter.org'
  },
  mother: {
    name: 'Mrs. Priya Sharma',
    occupation: 'Architectural Director',
    phone: '+91 98450 67890',
    email: 'priya.sharma@designstudio.in'
  },
  address: {
    street: '42 Palm Meadows Villa, Whitefield Boulevard',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560066'
  },
  transport: {
    opted: true,
    routeNumber: 'Route 14 (East Quadrant)',
    busNumber: 'KA-01-FS-4012',
    pickupStop: 'Palm Meadows Main Gate (07:15 AM)',
    dropStop: 'Palm Meadows Main Gate (03:45 PM)',
    driverName: 'Suresh Kumar (+91 98860 33441)'
  }
};

export const STUDENT_EXAM_RESULTS: Record<string, { termName: string; termDate: string; overallPercentage: number; cgpa: number; classRank: number; totalStudents: number; scores: ExamScore[] }> = {
  'term1_final': {
    termName: 'Term 1 Comprehensive Final Examination',
    termDate: 'October 2026',
    overallPercentage: 91.17,
    cgpa: 9.6,
    classRank: 3,
    totalStudents: 42,
    scores: [
      { subject: 'Mathematics', code: 'MATH-101', marksObtained: 96, maxMarks: 100, grade: 'A1', classAverage: 74.2, highestInClass: 99, remarks: 'Exemplary clarity in quadratic equations & geometric proofs.' },
      { subject: 'Physics', code: 'PHY-102', marksObtained: 91, maxMarks: 100, grade: 'A1', classAverage: 71.5, highestInClass: 96, remarks: 'Strong experimental reasoning and ray-diagram precision.' },
      { subject: 'Chemistry', code: 'CHEM-103', marksObtained: 88, maxMarks: 100, grade: 'A2', classAverage: 68.0, highestInClass: 95, remarks: 'Good grasp of stoichiometry and periodic chemical trends.' },
      { subject: 'Computer Science', code: 'CS-104', marksObtained: 98, maxMarks: 100, grade: 'A1', classAverage: 78.4, highestInClass: 100, remarks: 'Outstanding algorithmic complexity and clean Python syntax.' },
      { subject: 'English Literature', code: 'ENG-105', marksObtained: 85, maxMarks: 100, grade: 'A2', classAverage: 72.1, highestInClass: 92, remarks: 'Thoughtful interpretive essays; focus on syntax variety.' },
      { subject: 'Social Science', code: 'SOC-106', marksObtained: 89, maxMarks: 100, grade: 'A2', classAverage: 70.3, highestInClass: 94, remarks: 'Comprehensive historical timelines and geographic cartography.' }
    ]
  },
  'mid_term': {
    termName: 'Mid-Term Diagnostic Assessment',
    termDate: 'August 2026',
    overallPercentage: 88.5,
    cgpa: 9.2,
    classRank: 5,
    totalStudents: 42,
    scores: [
      { subject: 'Mathematics', code: 'MATH-101', marksObtained: 92, maxMarks: 100, grade: 'A1', classAverage: 72.0, highestInClass: 98, remarks: 'Good performance in algebra and polynomial equations.' },
      { subject: 'Physics', code: 'PHY-102', marksObtained: 87, maxMarks: 100, grade: 'A2', classAverage: 69.4, highestInClass: 94, remarks: 'Solid kinematics and Newton laws mechanics.' },
      { subject: 'Chemistry', code: 'CHEM-103', marksObtained: 84, maxMarks: 100, grade: 'A2', classAverage: 66.8, highestInClass: 92, remarks: 'Atomic structure and valence configuration verified.' },
      { subject: 'Computer Science', code: 'CS-104', marksObtained: 96, maxMarks: 100, grade: 'A1', classAverage: 75.1, highestInClass: 98, remarks: 'Exceptional data structures homework & test code.' },
      { subject: 'English Literature', code: 'ENG-105', marksObtained: 82, maxMarks: 100, grade: 'B1', classAverage: 70.0, highestInClass: 90, remarks: 'Poetry comprehension and vocabulary.' },
      { subject: 'Social Science', code: 'SOC-106', marksObtained: 90, maxMarks: 100, grade: 'A1', classAverage: 71.0, highestInClass: 93, remarks: 'Well-researched economics and civic governance questions.' }
    ]
  }
};

export const STUDENT_NOTICES: NoticeItem[] = [
  {
    id: 'not_1',
    title: 'SSC Board Class 10 Examination Registration & Subject Verification',
    category: 'EXAMINATION',
    publishDate: '01 Nov 2026',
    author: 'Examination Controller',
    department: 'Academic Office',
    isUrgent: true,
    content: 'All students of Grade 10-A must cross-check their candidate demographic credentials, spelling of parent names, and opted language codes with class mentor Mrs. Sarah Jenkins by Thursday, 05 Nov 2026.',
    attachmentName: 'SSC_Candidate_Verification_Checklist.pdf'
  },
  {
    id: 'not_2',
    title: 'Annual STEM & Robotics Exhibition 2026: Project Submissions',
    category: 'ACADEMIC',
    publishDate: '28 Oct 2026',
    author: 'Head of Science Department',
    department: 'STEM Division',
    isUrgent: false,
    content: 'Registration is now open for the FutureSchool Annual Science & Robotics Expo. Teams of 2 to 4 students can submit prototypes in clean energy, assistive robotics, and IoT agriculture.',
    attachmentName: 'STEM_Expo_Guidelines_2026.pdf'
  },
  {
    id: 'not_3',
    title: 'Diwali Festival Break & Campus Reopening Notice',
    category: 'HOLIDAY',
    publishDate: '24 Oct 2026',
    author: 'Principal Office',
    department: 'Administration',
    isUrgent: false,
    content: 'The campus will remain closed from 12 November to 16 November 2026 on account of the Diwali festival. Regular timetable classes will resume on Tuesday, 17 November 2026 at 08:00 AM.',
    attachmentName: 'Academic_Calendar_Holidays_Q4.pdf'
  },
  {
    id: 'not_4',
    title: 'Inter-House Athletic & Swimming Championship 2026',
    category: 'SPORTS',
    publishDate: '20 Oct 2026',
    author: 'Department of Physical Education',
    department: 'Sports Complex',
    isUrgent: false,
    content: 'Trials for 100m, 400m sprint and 4x100m relay will be conducted this Friday on Ground 1. House captains must submit verified roster sheets to Coach Briggs.',
    attachmentName: 'Athletics_Heats_Schedule.pdf'
  }
];

export const STUDENT_ATTENDANCE_OCTOBER: AttendanceDayLog[] = [
  { day: 1, date: '2026-10-01', status: 'PRESENT', morningCheckIn: '07:44 AM', afternoonCheckOut: '03:10 PM' },
  { day: 2, date: '2026-10-02', status: 'HOLIDAY', remarks: 'Gandhi Jayanti' },
  { day: 3, date: '2026-10-03', status: 'WEEKEND' },
  { day: 4, date: '2026-10-04', status: 'WEEKEND' },
  { day: 5, date: '2026-10-05', status: 'PRESENT', morningCheckIn: '07:48 AM', afternoonCheckOut: '03:05 PM' },
  { day: 6, date: '2026-10-06', status: 'PRESENT', morningCheckIn: '07:42 AM', afternoonCheckOut: '03:12 PM' },
  { day: 7, date: '2026-10-07', status: 'PRESENT', morningCheckIn: '07:49 AM', afternoonCheckOut: '03:15 PM' },
  { day: 8, date: '2026-10-08', status: 'PRESENT', morningCheckIn: '07:40 AM', afternoonCheckOut: '03:08 PM' },
  { day: 9, date: '2026-10-09', status: 'PRESENT', morningCheckIn: '07:51 AM', afternoonCheckOut: '03:10 PM' },
  { day: 10, date: '2026-10-10', status: 'WEEKEND' },
  { day: 11, date: '2026-10-11', status: 'WEEKEND' },
  { day: 12, date: '2026-10-12', status: 'PRESENT', morningCheckIn: '07:45 AM', afternoonCheckOut: '03:11 PM' },
  { day: 13, date: '2026-10-13', status: 'ABSENT', remarks: 'Sanctioned Medical Leave (Leave #101)' },
  { day: 14, date: '2026-10-14', status: 'PRESENT', morningCheckIn: '07:46 AM', afternoonCheckOut: '03:10 PM' },
  { day: 15, date: '2026-10-15', status: 'PRESENT', morningCheckIn: '07:43 AM', afternoonCheckOut: '03:07 PM' },
  { day: 16, date: '2026-10-16', status: 'PRESENT', morningCheckIn: '07:48 AM', afternoonCheckOut: '03:14 PM' },
  { day: 17, date: '2026-10-17', status: 'WEEKEND' },
  { day: 18, date: '2026-10-18', status: 'WEEKEND' },
  { day: 19, date: '2026-10-19', status: 'PRESENT', morningCheckIn: '07:47 AM', afternoonCheckOut: '03:09 PM' },
  { day: 20, date: '2026-10-20', status: 'LATE', morningCheckIn: '08:08 AM', afternoonCheckOut: '03:10 PM', remarks: 'Route 14 bus delayed in traffic' },
  { day: 21, date: '2026-10-21', status: 'PRESENT', morningCheckIn: '07:41 AM', afternoonCheckOut: '03:12 PM' },
  { day: 22, date: '2026-10-22', status: 'PRESENT', morningCheckIn: '07:44 AM', afternoonCheckOut: '03:06 PM' },
  { day: 23, date: '2026-10-23', status: 'PRESENT', morningCheckIn: '07:50 AM', afternoonCheckOut: '03:15 PM' },
  { day: 24, date: '2026-10-24', status: 'HOLIDAY', remarks: 'Dussehra / Vijayadashami' },
  { day: 25, date: '2026-10-25', status: 'WEEKEND' },
  { day: 26, date: '2026-10-26', status: 'PRESENT', morningCheckIn: '07:45 AM', afternoonCheckOut: '03:10 PM' },
  { day: 27, date: '2026-10-27', status: 'PRESENT', morningCheckIn: '07:43 AM', afternoonCheckOut: '03:08 PM' },
  { day: 28, date: '2026-10-28', status: 'PRESENT', morningCheckIn: '07:48 AM', afternoonCheckOut: '03:12 PM' },
  { day: 29, date: '2026-10-29', status: 'PRESENT', morningCheckIn: '07:42 AM', afternoonCheckOut: '03:11 PM' },
  { day: 30, date: '2026-10-30', status: 'PRESENT', morningCheckIn: '07:46 AM', afternoonCheckOut: '03:10 PM' },
  { day: 31, date: '2026-10-31', status: 'WEEKEND' }
];
