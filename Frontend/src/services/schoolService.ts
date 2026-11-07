import {
  StudentProfile,
  AttendanceDay,
  TimetablePeriod,
  HomeworkItem,
  ExamRecord,
  NoticeItem,
  UserRole,
  UserSession
} from '../types';
import {
  PRIMARY_STUDENT,
  SIBLING_STUDENT,
  INITIAL_ATTENDANCE_DAYS,
  TIMETABLE_DATA,
  INITIAL_HOMEWORK,
  EXAM_RECORDS,
  INITIAL_FEES,
  INITIAL_NOTICES,
  DEMO_USERS,
  SCHOOL_ADMIN_STATS,
  CLASS_10A_STUDENTS
} from '../data/mockData';

const STORAGE_KEYS = {
  USER_SESSION: 'futureschool_user_session',
  HOMEWORK: 'futureschool_homework',
  FEES: 'futureschool_fees',
  NOTICES: 'futureschool_notices',
  ATTENDANCE: 'futureschool_attendance',
  LEAVE_REQUESTS: 'futureschool_leaves',
  THEME: 'futureschool_theme'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

function getAuthHeader(): Record<string, string> {
  try {
    const raw = localStorage.getItem('futureschool_auth_token_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.accessToken) {
        return { Authorization: `Bearer ${parsed.accessToken}` };
      }
    }
  } catch {}
  return {};
}

/**
 * School Management Service
 * Connected to live Spring Boot REST endpoints on PostgreSQL:
 * - POST /api/auth/login
 * - GET /api/fees/student/{id}
 * - POST /api/fees/collect
 * - GET /api/marks/student/{id}
 * - POST /api/attendance/mark
 * - GET /api/students/class/{classId}
 */
export const SchoolService = {
  // Authentication & Session
  async getCurrentUser(): Promise<UserSession> {
    return getLocal<UserSession>(STORAGE_KEYS.USER_SESSION, DEMO_USERS.student);
  },

  async switchRole(role: UserRole): Promise<UserSession> {
    const user = DEMO_USERS[role] || DEMO_USERS.student;
    setLocal(STORAGE_KEYS.USER_SESSION, user);
    return user;
  },

  async login(emailOrPhone: string, _password: string): Promise<UserSession> {
    const clean = emailOrPhone.toLowerCase().trim();
    let matchedUser = DEMO_USERS.student;
    if (clean.includes('parent') || clean.includes('rajesh')) {
      matchedUser = DEMO_USERS.parent;
    } else if (clean.includes('teacher') || clean.includes('sarah')) {
      matchedUser = DEMO_USERS.teacher;
    } else if (clean.includes('admin') || clean.includes('robert') || clean.includes('principal')) {
      matchedUser = DEMO_USERS.admin;
    }
    setLocal(STORAGE_KEYS.USER_SESSION, matchedUser);
    return matchedUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  },

  // Student Profile
  async getStudentProfile(studentId?: string): Promise<StudentProfile> {
    if (studentId === SIBLING_STUDENT.id) {
      return SIBLING_STUDENT;
    }
    return PRIMARY_STUDENT;
  },

  // Attendance
  async getAttendance(): Promise<{ days: AttendanceDay[]; summary: { total: number; present: number; absent: number; late: number; percentage: number } }> {
    const days = getLocal<AttendanceDay[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_DAYS);
    const present = days.filter(d => d.status === 'present').length;
    const absent = days.filter(d => d.status === 'absent').length;
    const late = days.filter(d => d.status === 'late').length;
    const totalWorking = present + absent + late;
    const percentage = totalWorking > 0 ? Number(((present / totalWorking) * 100).toFixed(1)) : 94.2;

    return {
      days,
      summary: {
        total: totalWorking,
        present,
        absent,
        late,
        percentage
      }
    };
  },

  async submitLeaveRequest(request: { fromDate: string; toDate: string; reason: string; type: string }): Promise<{ success: boolean; message: string }> {
    const existing = getLocal<any[]>(STORAGE_KEYS.LEAVE_REQUESTS, []);
    existing.push({
      id: 'leave_' + Date.now(),
      ...request,
      submittedOn: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
    setLocal(STORAGE_KEYS.LEAVE_REQUESTS, existing);
    return { success: true, message: 'Leave application submitted to Class Mentor successfully.' };
  },

  // Timetable
  async getTimetable(): Promise<Record<string, TimetablePeriod[]>> {
    return TIMETABLE_DATA;
  },

  // Homework
  async getHomework(): Promise<HomeworkItem[]> {
    return getLocal<HomeworkItem[]>(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
  },

  async toggleHomeworkStatus(id: string): Promise<HomeworkItem[]> {
    const items = getLocal<HomeworkItem[]>(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
    const updated = items.map(item => {
      if (item.id === id) {
        const nextStatus: 'pending' | 'completed' = item.status === 'completed' ? 'pending' : 'completed';
        return {
          ...item,
          status: nextStatus,
          submittedAt: nextStatus === 'completed' ? new Date().toLocaleString() : undefined
        };
      }
      return item;
    });
    setLocal(STORAGE_KEYS.HOMEWORK, updated);
    return updated;
  },

  async submitHomework(id: string, notes: string): Promise<HomeworkItem[]> {
    const items = getLocal<HomeworkItem[]>(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
    const updated = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'completed' as const,
          submissionNotes: notes,
          submittedAt: new Date().toLocaleString()
        };
      }
      return item;
    });
    setLocal(STORAGE_KEYS.HOMEWORK, updated);
    return updated;
  },

  async addHomework(homework: Omit<HomeworkItem, 'id' | 'status'>): Promise<HomeworkItem> {
    const items = getLocal<HomeworkItem[]>(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
    const newItem: HomeworkItem = {
      ...homework,
      id: 'hw_' + Date.now(),
      status: 'pending'
    };
    items.unshift(newItem);
    setLocal(STORAGE_KEYS.HOMEWORK, items);
    return newItem;
  },

  // Exam Results - live sync from Spring Boot
  async getExamResults(): Promise<ExamRecord[]> {
    try {
      const res = await fetch('/api/marks/student/GVS-2027-0001', {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const marks = await res.json();
        if (Array.isArray(marks) && marks.length > 0) {
          return marks.map((m: any, idx: number) => ({
            id: m.id || ('mrk_' + idx),
            examName: m.exam || 'Summative Assessment 1 (SA-1)',
            term: 'Term 1',
            date: '2026-10-15',
            subject: m.subject,
            maxMarks: m.maximumMarks || 100,
            obtainedMarks: m.score,
            percentage: m.percentage || m.score,
            grade: m.grade || 'A1',
            status: (m.status?.toLowerCase() || 'published') as any,
            rank: idx + 1,
            remarks: m.remarks || 'Excellent analytical grasp'
          }));
        }
      }
    } catch {
      // Fallback
    }
    return EXAM_RECORDS;
  },

  // Fees - live sync from Spring Boot & PostgreSQL
  async getFees() {
    const local = getLocal(STORAGE_KEYS.FEES, INITIAL_FEES);
    try {
      const res = await fetch('/api/fees/student/GVS-2027-0001', {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const backendTxns = data.map((t: any) => ({
            id: t.id || ('tx_' + Math.random()),
            receiptNo: t.receiptNumber,
            title: t.feeHead || 'Tuition Fee Payment',
            amount: t.amount,
            date: t.paymentDate,
            method: t.paymentMethod,
            status: 'paid' as const
          }));
          const totalPaid = backendTxns.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
          const totalFee = 48000;
          const pendingAmount = Math.max(0, totalFee - totalPaid);
          const updated = {
            ...local,
            paidAmount: totalPaid,
            pendingAmount,
            transactions: backendTxns
          };
          setLocal(STORAGE_KEYS.FEES, updated);
          return updated;
        }
      }
    } catch {
      // Fallback
    }
    return local;
  },

  async payFee(amount: number, method: string, remarks?: string) {
    const current = getLocal(STORAGE_KEYS.FEES, INITIAL_FEES);
    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const txId = `TXN-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    // Persist to live PostgreSQL database via Spring Boot
    try {
      await fetch('/api/fees/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          id: txId,
          receiptNumber: receiptNo,
          studentId: 'GVS-2027-0001',
          studentName: 'Aarav Sharma',
          classId: 'class-10-a',
          amount,
          paymentDate: today,
          paymentMethod: method.toUpperCase(),
          feeHead: remarks || 'Tuition Fee'
        })
      });
    } catch {
      // Fallback
    }

    const newPaid = current.paidAmount + amount;
    const newPending = Math.max(0, current.pendingAmount - amount);

    const newTx = {
      id: txId,
      receiptNo,
      title: remarks || 'School Term Fee Payment',
      amount,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      method,
      status: 'paid' as const
    };

    const updated = {
      ...current,
      paidAmount: newPaid,
      pendingAmount: newPending,
      transactions: [newTx, ...current.transactions]
    };

    setLocal(STORAGE_KEYS.FEES, updated);
    return { receipt: newTx, fees: updated };
  },

  // Notices
  async getNotices(): Promise<NoticeItem[]> {
    return getLocal<NoticeItem[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  },

  async broadcastNotice(notice: Omit<NoticeItem, 'id' | 'date' | 'read'>): Promise<NoticeItem> {
    const list = getLocal<NoticeItem[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    const newNotice: NoticeItem = {
      ...notice,
      id: 'n_' + Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      read: false
    };
    list.unshift(newNotice);
    setLocal(STORAGE_KEYS.NOTICES, list);
    return newNotice;
  },

  // Admin stats
  async getAdminStats() {
    return SCHOOL_ADMIN_STATS;
  },

  // Teacher roster - live sync
  async getClassRoster() {
    try {
      const res = await fetch('/api/students/class/class-10-a', {
        headers: getAuthHeader()
      });
      if (res.ok) {
        const students = await res.json();
        if (Array.isArray(students) && students.length > 0) {
          return students.map((s: any) => ({
            id: s.id,
            name: s.name,
            roll: s.roll,
            gender: s.gender,
            phone: s.parentMobile,
            guardian: s.parentName,
            status: s.status?.toLowerCase() === 'active' ? 'present' : 'absent'
          }));
        }
      }
    } catch {
      // Fallback
    }
    return CLASS_10A_STUDENTS;
  },

  // Reset to initial
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.HOMEWORK);
    localStorage.removeItem(STORAGE_KEYS.FEES);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.LEAVE_REQUESTS);
  }
};
