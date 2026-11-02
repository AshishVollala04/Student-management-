import {
  StudentProfile,
  AttendanceDay,
  TimetablePeriod,
  HomeworkItem,
  ExamRecord,
  FeeTransaction,
  FeeBreakdownItem,
  NoticeItem,
  UserSession
} from '../types';

export const DEMO_USERS: Record<string, UserSession> = {
  student: {
    id: 'usr_student_01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@futureschool.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=c0aede',
    roleDescription: 'Grade 10-A · Roll #18'
  },
  parent: {
    id: 'usr_parent_01',
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@medcenter.org',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rajesh&backgroundColor=b6e3f4',
    roleDescription: 'Parent of Aarav (10-A) & Ananya (6-B)'
  },
  teacher: {
    id: 'usr_teacher_01',
    name: 'Mrs. Sarah Jenkins',
    email: 's.jenkins@futureschool.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=ffd5dc',
    roleDescription: 'Head of Mathematics · Mentor 10-A'
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Principal Robert Vance',
    email: 'admin@futureschool.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Robert&backgroundColor=d1d4f9',
    roleDescription: 'School Principal & Academic Director'
  }
};

export const PRIMARY_STUDENT: StudentProfile = {
  id: 'std_10018',
  name: 'Aarav Sharma',
  rollNo: 18,
  grade: 'Class 10',
  section: 'A',
  admissionNo: 'FS-2021-0492',
  academicYear: '2026-2027',
  dob: '14 May 2011',
  gender: 'Male',
  bloodGroup: 'O+ Positive',
  house: 'Newton Green House',
  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=c0aede',
  attendancePercentage: 94.2,
  parents: {
    fatherName: 'Dr. Rajesh Sharma',
    fatherOccupation: 'Senior Cardiologist, Metro Hospital',
    fatherPhone: '+1 (555) 382-9912',
    motherName: 'Sunita Sharma',
    motherOccupation: 'Architectural Director, Studio Alpha',
    motherPhone: '+1 (555) 382-9915',
    email: 'rajesh.sharma@medcenter.org',
    address: '42 Pinecrest Avenue, North Academic Enclave, Metro City'
  },
  emergencyContact: {
    name: 'Dr. Rajesh Sharma',
    relationship: 'Father',
    phone: '+1 (555) 382-9912'
  }
};

export const SIBLING_STUDENT: StudentProfile = {
  id: 'std_10009',
  name: 'Ananya Sharma',
  rollNo: 9,
  grade: 'Class 6',
  section: 'B',
  admissionNo: 'FS-2023-0814',
  academicYear: '2026-2027',
  dob: '22 August 2015',
  gender: 'Female',
  bloodGroup: 'B+ Positive',
  house: 'Curie Blue House',
  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ananya&backgroundColor=ffdfbf',
  attendancePercentage: 96.8,
  parents: {
    fatherName: 'Dr. Rajesh Sharma',
    fatherOccupation: 'Senior Cardiologist, Metro Hospital',
    fatherPhone: '+1 (555) 382-9912',
    motherName: 'Sunita Sharma',
    motherOccupation: 'Architectural Director, Studio Alpha',
    motherPhone: '+1 (555) 382-9915',
    email: 'rajesh.sharma@medcenter.org',
    address: '42 Pinecrest Avenue, North Academic Enclave, Metro City'
  },
  emergencyContact: {
    name: 'Dr. Rajesh Sharma',
    relationship: 'Father',
    phone: '+1 (555) 382-9912'
  }
};

export const INITIAL_ATTENDANCE_DAYS: AttendanceDay[] = [
  { date: '2026-10-01', dayNumber: 1, status: 'present', checkInTime: '07:48 AM', remark: 'On time' },
  { date: '2026-10-02', dayNumber: 2, status: 'present', checkInTime: '07:52 AM', remark: 'On time' },
  { date: '2026-10-03', dayNumber: 3, status: 'holiday', remark: 'Gandhi Jayanti Public Holiday' },
  { date: '2026-10-04', dayNumber: 4, status: 'holiday', remark: 'Sunday Weekend' },
  { date: '2026-10-05', dayNumber: 5, status: 'present', checkInTime: '07:44 AM', remark: 'On time' },
  { date: '2026-10-06', dayNumber: 6, status: 'late', checkInTime: '08:14 AM', remark: 'Traffic congestion on bridge' },
  { date: '2026-10-07', dayNumber: 7, status: 'present', checkInTime: '07:50 AM', remark: 'On time' },
  { date: '2026-10-08', dayNumber: 8, status: 'present', checkInTime: '07:45 AM', remark: 'On time' },
  { date: '2026-10-09', dayNumber: 9, status: 'present', checkInTime: '07:55 AM', remark: 'On time' },
  { date: '2026-10-10', dayNumber: 10, status: 'holiday', remark: '2nd Saturday Activity Day' },
  { date: '2026-10-11', dayNumber: 11, status: 'holiday', remark: 'Sunday Weekend' },
  { date: '2026-10-12', dayNumber: 12, status: 'present', checkInTime: '07:49 AM', remark: 'On time' },
  { date: '2026-10-13', dayNumber: 13, status: 'absent', remark: 'Medical leave - Mild fever (Sanctioned)' },
  { date: '2026-10-14', dayNumber: 14, status: 'present', checkInTime: '07:51 AM', remark: 'On time' },
  { date: '2026-10-15', dayNumber: 15, status: 'present', checkInTime: '07:46 AM', remark: 'On time' },
  { date: '2026-10-16', dayNumber: 16, status: 'present', checkInTime: '07:48 AM', remark: 'On time' },
  { date: '2026-10-17', dayNumber: 17, status: 'present', checkInTime: '07:54 AM', remark: 'On time' },
  { date: '2026-10-18', dayNumber: 18, status: 'holiday', remark: 'Sunday Weekend' },
  { date: '2026-10-19', dayNumber: 19, status: 'present', checkInTime: '07:42 AM', remark: 'On time' },
  { date: '2026-10-20', dayNumber: 20, status: 'late', checkInTime: '08:08 AM', remark: 'Bus delayed by 10 mins' },
  { date: '2026-10-21', dayNumber: 21, status: 'present', checkInTime: '07:49 AM', remark: 'On time' },
  { date: '2026-10-22', dayNumber: 22, status: 'present', checkInTime: '07:51 AM', remark: 'On time' },
  { date: '2026-10-23', dayNumber: 23, status: 'present', checkInTime: '07:45 AM', remark: 'On time' },
  { date: '2026-10-24', dayNumber: 24, status: 'holiday', remark: 'Dussehra Holiday' },
  { date: '2026-10-25', dayNumber: 25, status: 'holiday', remark: 'Sunday Weekend' },
  { date: '2026-10-26', dayNumber: 26, status: 'present', checkInTime: '07:47 AM', remark: 'On time' },
  { date: '2026-10-27', dayNumber: 27, status: 'present', checkInTime: '07:50 AM', remark: 'On time' },
  { date: '2026-10-28', dayNumber: 28, status: 'present', checkInTime: '07:43 AM', remark: 'On time' },
  { date: '2026-10-29', dayNumber: 29, status: 'present', checkInTime: '07:52 AM', remark: 'On time' },
  { date: '2026-10-30', dayNumber: 30, status: 'present', checkInTime: '07:46 AM', remark: 'On time' },
  { date: '2026-10-31', dayNumber: 31, status: 'holiday', remark: 'Autumn Recess' }
];

export const TIMETABLE_DATA: Record<string, TimetablePeriod[]> = {
  Monday: [
    { id: 'm1', period: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304' },
    { id: 'm2', period: 2, startTime: '08:50 AM', endTime: '09:35 AM', subject: 'Physics', teacher: 'Dr. Michael Chen', room: 'Physics Lab 2' },
    { id: 'm3', period: 3, startTime: '09:40 AM', endTime: '10:25 AM', subject: 'English Literature', teacher: 'Ms. Clara Oswald', room: 'Room 201' },
    { id: 'mb', period: 0, startTime: '10:25 AM', endTime: '10:55 AM', subject: 'Morning Break & Refreshment', teacher: 'Campus Grounds', room: 'Dining Hall', isBreak: true },
    { id: 'm4', period: 4, startTime: '10:55 AM', endTime: '11:40 AM', subject: 'Chemistry', teacher: 'Prof. David Vance', room: 'Chem Lab 1' },
    { id: 'm5', period: 5, startTime: '11:45 AM', endTime: '12:30 PM', subject: 'Computer Science', teacher: 'Mr. Alan Turing Jr.', room: 'Computer Lab 3' },
    { id: 'ml', period: 0, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Lunch & Recreation', teacher: 'Cafeteria & Court', room: 'Main Quad', isBreak: true },
    { id: 'm6', period: 6, startTime: '01:15 PM', endTime: '02:00 PM', subject: 'Biology', teacher: 'Dr. Evelyn Reed', room: 'Bio Lab' },
    { id: 'm7', period: 7, startTime: '02:05 PM', endTime: '02:50 PM', subject: 'Physical Education', teacher: 'Coach Marcus Bell', room: 'Athletic Field' }
  ],
  Tuesday: [
    { id: 't1', period: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Physics', teacher: 'Dr. Michael Chen', room: 'Physics Lab 2' },
    { id: 't2', period: 2, startTime: '08:50 AM', endTime: '09:35 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304' },
    { id: 't3', period: 3, startTime: '09:40 AM', endTime: '10:25 AM', subject: 'Social Sciences', teacher: 'Mr. Julian Croft', room: 'Room 108' },
    { id: 'tb', period: 0, startTime: '10:25 AM', endTime: '10:55 AM', subject: 'Morning Break', teacher: 'Campus Grounds', room: 'Courtyard', isBreak: true },
    { id: 't4', period: 4, startTime: '10:55 AM', endTime: '11:40 AM', subject: 'English Language', teacher: 'Ms. Clara Oswald', room: 'Room 201' },
    { id: 't5', period: 5, startTime: '11:45 AM', endTime: '12:30 PM', subject: 'Biology', teacher: 'Dr. Evelyn Reed', room: 'Bio Lab' },
    { id: 'tl', period: 0, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Lunch Break', teacher: 'Dining Staff', room: 'Dining Hall', isBreak: true },
    { id: 't6', period: 6, startTime: '01:15 PM', endTime: '02:00 PM', subject: 'Chemistry Lab', teacher: 'Prof. David Vance', room: 'Chem Lab 1' },
    { id: 't7', period: 7, startTime: '02:05 PM', endTime: '02:50 PM', subject: 'Art & Design', teacher: 'Ms. Sophia Rossi', room: 'Art Studio B' }
  ],
  Wednesday: [
    { id: 'w1', period: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Chemistry', teacher: 'Prof. David Vance', room: 'Chem Lab 1' },
    { id: 'w2', period: 2, startTime: '08:50 AM', endTime: '09:35 AM', subject: 'Computer Science', teacher: 'Mr. Alan Turing Jr.', room: 'Computer Lab 3' },
    { id: 'w3', period: 3, startTime: '09:40 AM', endTime: '10:25 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304' },
    { id: 'wb', period: 0, startTime: '10:25 AM', endTime: '10:55 AM', subject: 'Morning Break', teacher: 'Campus Staff', room: 'Courtyard', isBreak: true },
    { id: 'w4', period: 4, startTime: '10:55 AM', endTime: '11:40 AM', subject: 'Physics Lab', teacher: 'Dr. Michael Chen', room: 'Physics Lab 2' },
    { id: 'w5', period: 5, startTime: '11:45 AM', endTime: '12:30 PM', subject: 'English Literature', teacher: 'Ms. Clara Oswald', room: 'Room 201' },
    { id: 'wl', period: 0, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Lunch Break', teacher: 'Dining Staff', room: 'Dining Hall', isBreak: true },
    { id: 'w6', period: 6, startTime: '01:15 PM', endTime: '02:00 PM', subject: 'World History', teacher: 'Mr. Julian Croft', room: 'Room 108' },
    { id: 'w7', period: 7, startTime: '02:05 PM', endTime: '02:50 PM', subject: 'Library & Research', teacher: 'Mrs. Deborah Hayes', room: 'Central Library' }
  ],
  Thursday: [
    { id: 'th1', period: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304' },
    { id: 'th2', period: 2, startTime: '08:50 AM', endTime: '09:35 AM', subject: 'English Literature', teacher: 'Ms. Clara Oswald', room: 'Room 201' },
    { id: 'th3', period: 3, startTime: '09:40 AM', endTime: '10:25 AM', subject: 'Biology Lab', teacher: 'Dr. Evelyn Reed', room: 'Bio Lab' },
    { id: 'thb', period: 0, startTime: '10:25 AM', endTime: '10:55 AM', subject: 'Morning Break', teacher: 'Campus Staff', room: 'Courtyard', isBreak: true },
    { id: 'th4', period: 4, startTime: '10:55 AM', endTime: '11:40 AM', subject: 'Physics', teacher: 'Dr. Michael Chen', room: 'Physics Lab 2' },
    { id: 'th5', period: 5, startTime: '11:45 AM', endTime: '12:30 PM', subject: 'Chemistry', teacher: 'Prof. David Vance', room: 'Room 304' },
    { id: 'thl', period: 0, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Lunch Break', teacher: 'Dining Staff', room: 'Dining Hall', isBreak: true },
    { id: 'th6', period: 6, startTime: '01:15 PM', endTime: '02:00 PM', subject: 'Foreign Language (French)', teacher: 'Mme. Celine Dupont', room: 'Language Room 12' },
    { id: 'th7', period: 7, startTime: '02:05 PM', endTime: '02:50 PM', subject: 'Physical Education', teacher: 'Coach Marcus Bell', room: 'Indoor Gymnasium' }
  ],
  Friday: [
    { id: 'f1', period: 1, startTime: '08:00 AM', endTime: '08:45 AM', subject: 'Computer Science Practical', teacher: 'Mr. Alan Turing Jr.', room: 'Computer Lab 3' },
    { id: 'f2', period: 2, startTime: '08:50 AM', endTime: '09:35 AM', subject: 'Computer Science Practical', teacher: 'Mr. Alan Turing Jr.', room: 'Computer Lab 3' },
    { id: 'f3', period: 3, startTime: '09:40 AM', endTime: '10:25 AM', subject: 'Mathematics', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304' },
    { id: 'fb', period: 0, startTime: '10:25 AM', endTime: '10:55 AM', subject: 'Morning Break', teacher: 'Campus Staff', room: 'Courtyard', isBreak: true },
    { id: 'f4', period: 4, startTime: '10:55 AM', endTime: '11:40 AM', subject: 'Social Studies', teacher: 'Mr. Julian Croft', room: 'Room 108' },
    { id: 'f5', period: 5, startTime: '11:45 AM', endTime: '12:30 PM', subject: 'Chemistry', teacher: 'Prof. David Vance', room: 'Chem Lab 1' },
    { id: 'fl', period: 0, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Lunch Break', teacher: 'Dining Staff', room: 'Dining Hall', isBreak: true },
    { id: 'f6', period: 6, startTime: '01:15 PM', endTime: '02:00 PM', subject: 'Physics Seminar', teacher: 'Dr. Michael Chen', room: 'Auditorium West' },
    { id: 'f7', period: 7, startTime: '02:05 PM', endTime: '02:50 PM', subject: 'Club Activities & Mentorship', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304' }
  ],
  Saturday: [
    { id: 's1', period: 1, startTime: '08:30 AM', endTime: '09:15 AM', subject: 'Robotics & STEM Workshop', teacher: 'Mr. Alan Turing Jr.', room: 'Innovation Hub' },
    { id: 's2', period: 2, startTime: '09:20 AM', endTime: '10:05 AM', subject: 'Mathematics Doubt Clearing', teacher: 'Mrs. Sarah Jenkins', room: 'Room 304' },
    { id: 'sb', period: 0, startTime: '10:05 AM', endTime: '10:35 AM', subject: 'Short Refreshment', teacher: 'Campus Staff', room: 'Cafeteria', isBreak: true },
    { id: 's3', period: 3, startTime: '10:35 AM', endTime: '11:20 AM', subject: 'Inter-House Debate & Quiz', teacher: 'Ms. Clara Oswald', room: 'Main Auditorium' },
    { id: 's4', period: 4, startTime: '11:25 AM', endTime: '12:15 PM', subject: 'Sports Practice & Athletics', teacher: 'Coach Marcus Bell', room: 'Track & Field' }
  ]
};

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw_01',
    subject: 'Mathematics',
    title: 'Quadratic Equations & Parabolic Modelling',
    description: 'Solve textbook exercises 4.3 (Questions 1 to 14) on vertex form and complete the graphical problem set on projectile trajectories.',
    assignedDate: '28 Oct 2026',
    dueDate: '02 Nov 2026',
    status: 'pending',
    teacherName: 'Mrs. Sarah Jenkins'
  },
  {
    id: 'hw_02',
    subject: 'Physics',
    title: 'Refraction & Snell\'s Law Lab Report',
    description: 'Compile the experimental verification data for prism refractive indices with error calculation and Ray diagrams.',
    assignedDate: '29 Oct 2026',
    dueDate: '03 Nov 2026',
    status: 'pending',
    teacherName: 'Dr. Michael Chen'
  },
  {
    id: 'hw_03',
    subject: 'English Literature',
    title: 'The Merchant of Venice Critical Commentary',
    description: 'Write a 650-word analytical essay discussing the courtroom scene, focusing on Portia\'s mercy monologue and the theme of justice.',
    assignedDate: '27 Oct 2026',
    dueDate: '04 Nov 2026',
    status: 'pending',
    teacherName: 'Ms. Clara Oswald'
  },
  {
    id: 'hw_04',
    subject: 'Computer Science',
    title: 'Object-Oriented Banking System in Python',
    description: 'Implement Account, SavingsAccount, and Transaction classes with deposit, withdrawal, and transfer methods with unit tests.',
    assignedDate: '24 Oct 2026',
    dueDate: '29 Oct 2026',
    status: 'completed',
    teacherName: 'Mr. Alan Turing Jr.',
    submissionNotes: 'Submitted GitHub repository link and output terminal logs.',
    submittedAt: '28 Oct 2026, 04:30 PM'
  },
  {
    id: 'hw_05',
    subject: 'Chemistry',
    title: 'Balancing Redox Reactions in Acidic Medium',
    description: 'Complete the ion-electron worksheet problems 1-10 for permanganate and dichromate oxidations.',
    assignedDate: '22 Oct 2026',
    dueDate: '27 Oct 2026',
    status: 'completed',
    teacherName: 'Prof. David Vance',
    submissionNotes: 'Handwritten scanned PDF uploaded.',
    submittedAt: '26 Oct 2026, 08:15 PM'
  }
];

export const EXAM_RECORDS: ExamRecord[] = [
  {
    id: 'exam_term1_2026',
    title: 'Term 1 Mid-Year Comprehensive Examination',
    academicYear: '2026-2027',
    date: 'September 2026',
    overallPercentage: 92.4,
    overallGrade: 'A1 (Outstanding)',
    rank: 3,
    totalStudentsInClass: 42,
    subjects: [
      { id: 's1', subject: 'Mathematics', marksObtained: 96, maxMarks: 100, grade: 'A1', remarks: 'Superb algebraic formulation and calculus intuition.' },
      { id: 's2', subject: 'Physics', marksObtained: 92, maxMarks: 100, grade: 'A1', remarks: 'Strong conceptual clarity in Kinematics and Optics.' },
      { id: 's3', subject: 'Chemistry', marksObtained: 89, maxMarks: 100, grade: 'A2', remarks: 'Good work; revise stoichiometry and organic pathways.' },
      { id: 's4', subject: 'Biology', marksObtained: 91, maxMarks: 100, grade: 'A1', remarks: 'Excellent diagrams and neat cellular genetics writeup.' },
      { id: 's5', subject: 'Computer Science', marksObtained: 98, maxMarks: 100, grade: 'A1', remarks: 'Class highest score. Exemplary algorithm design.' },
      { id: 's6', subject: 'English Literature', marksObtained: 88, maxMarks: 100, grade: 'A2', remarks: 'Eloquent prose style; enhance comparative literary arguments.' }
    ],
    comparisonWithPrevious: [
      { examName: 'Unit Test 1', percentage: 86.5 },
      { examName: 'Quarterly Assessment', percentage: 89.0 },
      { examName: 'Mid-Term Exam', percentage: 90.2 },
      { examName: 'Term 1 Final', percentage: 92.4 }
    ]
  },
  {
    id: 'exam_midterm_2026',
    title: 'Mid-Term Assessment Series',
    academicYear: '2026-2027',
    date: 'July 2026',
    overallPercentage: 90.2,
    overallGrade: 'A1',
    rank: 5,
    totalStudentsInClass: 42,
    subjects: [
      { id: 's1', subject: 'Mathematics', marksObtained: 94, maxMarks: 100, grade: 'A1', remarks: 'Consistent problem solving.' },
      { id: 's2', subject: 'Physics', marksObtained: 88, maxMarks: 100, grade: 'A2', remarks: 'Minor numerical errors in dynamics.' },
      { id: 's3', subject: 'Chemistry', marksObtained: 87, maxMarks: 100, grade: 'A2', remarks: 'Needs more practice in balancing equations.' },
      { id: 's4', subject: 'Biology', marksObtained: 90, maxMarks: 100, grade: 'A1', remarks: 'Very thorough understanding.' },
      { id: 's5', subject: 'Computer Science', marksObtained: 97, maxMarks: 100, grade: 'A1', remarks: 'Brilliant logic implementation.' },
      { id: 's6', subject: 'English Literature', marksObtained: 85, maxMarks: 100, grade: 'A2', remarks: 'Good grammar and comprehension.' }
    ],
    comparisonWithPrevious: [
      { examName: 'Unit Test 1', percentage: 86.5 },
      { examName: 'Quarterly Assessment', percentage: 89.0 },
      { examName: 'Mid-Term Exam', percentage: 90.2 }
    ]
  }
];

export const INITIAL_FEES = {
  totalFees: 4800,
  paidAmount: 3600,
  pendingAmount: 1200,
  dueDate: '15 Nov 2026',
  breakdown: [
    { id: 'f1', category: 'Academic Tuition & Faculty Fee', amount: 2600, status: 'paid' as const },
    { id: 'f2', category: 'STEM Laboratories & Robotics Workshop', amount: 650, status: 'paid' as const },
    { id: 'f3', category: 'Digital Library & E-Learning Portal', amount: 350, status: 'paid' as const },
    { id: 'f4', category: 'Sports Complex & Swimming Pavilion', amount: 400, status: 'pending' as const },
    { id: 'f5', category: 'Term 2 Campus Development & Transportation', amount: 800, status: 'pending' as const }
  ],
  transactions: [
    { id: 'tx_01', receiptNo: 'FS-REC-2026-904', title: 'Term 1 Tuition & Lab Fees', amount: 2400, date: '10 Aug 2026', method: 'Online NetBanking (HDFC)', status: 'paid' as const },
    { id: 'tx_02', receiptNo: 'FS-REC-2026-442', title: 'STEM & Digital Library Resources', amount: 1200, date: '15 Sep 2026', method: 'Credit Card (Visa ··4821)', status: 'paid' as const }
  ]
};

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'n_01',
    title: 'FutureSchool Annual STEM & Robotics Expo 2026',
    content: 'All students from Grades 6 to 12 are invited to submit their innovative project abstracts for the Annual STEM Expo. Category awards will be presented by the State Technology Council. Final registration deadline is November 10th.',
    date: '31 Oct 2026',
    category: 'announcement',
    priority: 'high',
    author: 'Principal Vance',
    authorRole: 'Administration',
    read: false
  },
  {
    id: 'n_02',
    title: 'Term 2 Mid-Assessment Datesheet Released',
    content: 'The schedule for the upcoming November Mid-Assessments has been published on the student portal. Morning sessions will commence at 08:30 AM sharp. Please review room seating arrangements in advance.',
    date: '29 Oct 2026',
    category: 'exam',
    priority: 'high',
    author: 'Academic Directorate',
    authorRole: 'Examination Cell',
    read: false
  },
  {
    id: 'n_03',
    title: 'National Unity Day & Autumn Holiday Circular',
    content: 'The school campus will remain closed on Friday, November 6th on account of the scheduled regional holiday. Special online quiz competition results will be posted on Saturday.',
    date: '28 Oct 2026',
    category: 'holiday',
    priority: 'normal',
    author: 'General Office',
    authorRole: 'Administrative Dean',
    read: true
  },
  {
    id: 'n_04',
    title: 'Parent-Teacher Conference (Term 1 Feedback)',
    content: 'The semester Parent-Teacher Conference is scheduled for Saturday, November 14th from 09:00 AM to 01:30 PM. Parents can book individualized 15-minute consultation slots with class mentors.',
    date: '25 Oct 2026',
    category: 'urgent',
    priority: 'high',
    author: 'Mrs. Sarah Jenkins',
    authorRole: 'Faculty Coordinator',
    read: true
  },
  {
    id: 'n_05',
    title: 'Winter Uniform Transition Mandatory from Nov 15th',
    content: 'All students are requested to transition to the official FutureSchool navy blazer, full-sleeve shirt, and monogrammed pullover starting Monday, November 15th.',
    date: '22 Oct 2026',
    category: 'announcement',
    priority: 'normal',
    author: 'Campus Affairs',
    authorRole: 'Student Welfare',
    read: true
  }
];

export const SCHOOL_ADMIN_STATS = {
  totalStudents: 614,
  presentToday: 591,
  attendanceRate: 96.2,
  totalTeachers: 38,
  activeClassrooms: 24,
  totalFeesTarget: 2947200,
  feesCollected: 2628900,
  collectionRate: 89.2,
  pendingAssignments: 142,
  noticesPublishedThisMonth: 12,
  studentDistribution: [
    { grade: 'Class 6', count: 96, attendance: 97.1 },
    { grade: 'Class 7', count: 102, attendance: 95.8 },
    { grade: 'Class 8', count: 104, attendance: 96.4 },
    { grade: 'Class 9', count: 108, attendance: 94.9 },
    { grade: 'Class 10', count: 104, attendance: 96.5 },
    { grade: 'Class 11', count: 52, attendance: 97.0 },
    { grade: 'Class 12', count: 48, attendance: 98.1 }
  ]
};

// Teacher class roster for 10-A
export const CLASS_10A_STUDENTS = [
  { rollNo: 1, name: 'Aadhya Patel', status: 'present' as const, avgScore: 94 },
  { rollNo: 2, name: 'Aditya Nair', status: 'present' as const, avgScore: 88 },
  { rollNo: 3, name: 'Aryan Kapoor', status: 'late' as const, avgScore: 82 },
  { rollNo: 4, name: 'Avani Deshmukh', status: 'present' as const, avgScore: 91 },
  { rollNo: 5, name: 'Devansh Reddy', status: 'absent' as const, avgScore: 79 },
  { rollNo: 6, name: 'Diya Sen', status: 'present' as const, avgScore: 96 },
  { rollNo: 7, name: 'Ishaan Verma', status: 'present' as const, avgScore: 85 },
  { rollNo: 8, name: 'Kabir Malhotra', status: 'present' as const, avgScore: 89 },
  { rollNo: 18, name: 'Aarav Sharma', status: 'present' as const, avgScore: 92 },
  { rollNo: 19, name: 'Rohan Mehra', status: 'present' as const, avgScore: 87 }
];
