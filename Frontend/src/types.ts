export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export type ScreenType = 
  | 'login'
  | 'dashboard'
  | 'attendance'
  | 'timetable'
  | 'homework'
  | 'exams'
  | 'fees'
  | 'notices'
  | 'profile'
  | 'parent-portal'
  | 'teacher-portal'
  | 'admin-portal';

export type TabType = 'home' | 'academics' | 'notices' | 'profile';

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: number;
  grade: string;
  section: string;
  admissionNo: string;
  academicYear: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  house: string;
  avatar: string;
  attendancePercentage: number;
  parents: {
    fatherName: string;
    fatherOccupation: string;
    fatherPhone: string;
    motherName: string;
    motherOccupation: string;
    motherPhone: string;
    email: string;
    address: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  status: AttendanceStatus;
  checkInTime?: string;
  remark?: string;
}

export interface TimetablePeriod {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  isBreak?: boolean;
}

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'completed';
  teacherName: string;
  submissionNotes?: string;
  submittedAt?: string;
}

export interface SubjectMarks {
  id: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

export interface ExamRecord {
  id: string;
  title: string;
  academicYear: string;
  date: string;
  overallPercentage: number;
  overallGrade: string;
  rank: number;
  totalStudentsInClass: number;
  subjects: SubjectMarks[];
  comparisonWithPrevious: {
    examName: string;
    percentage: number;
  }[];
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  title: string;
  amount: number;
  date: string;
  method: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface FeeBreakdownItem {
  id: string;
  category: string;
  amount: number;
  status: 'paid' | 'pending';
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'announcement' | 'exam' | 'holiday' | 'urgent';
  priority: 'normal' | 'high';
  author: string;
  authorRole: string;
  read?: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  roleDescription: string;
}
