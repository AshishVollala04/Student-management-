import {
  LeaveRequestWorkflow,
  TeacherLeaveWorkflow,
  MarksEntryWorkflow,
  ReportCardWorkflow,
  FeePaymentWorkflow,
  HallTicketReleaseWorkflow,
  TransportChangeWorkflow,
  ComplaintWorkflow,
  ConfigApprovalWorkflow
} from '../types/workflow';

const STORAGE_KEY = 'futureschool_master_workflow_v2';

export interface WorkflowState {
  leaveRequests: LeaveRequestWorkflow[];
  teacherLeaves: TeacherLeaveWorkflow[];
  marksEntries: MarksEntryWorkflow[];
  reportCards: ReportCardWorkflow[];
  fees: FeePaymentWorkflow;
  hallTickets: HallTicketReleaseWorkflow[];
  transportRequests: TransportChangeWorkflow[];
  complaints: ComplaintWorkflow[];
  configs: ConfigApprovalWorkflow[];
  activeScenario?: string;
}

const DEFAULT_STATE: WorkflowState = {
  leaveRequests: [
    {
      id: 'leave_101',
      studentId: 'GVS-2027-0001',
      studentName: 'Aarav Sharma',
      grade: 'Grade 10',
      section: 'A',
      leaveType: 'Medical Sanction',
      startDate: '2026-11-04',
      endDate: '2026-11-05',
      reason: 'Scheduled ophthalmology consultation and recovery.',
      parentName: 'Dr. Rajesh Sharma',
      status: 'PENDING',
      appliedDate: '2026-11-01'
    }
  ],
  teacherLeaves: [
    {
      id: 'tch_leave_201',
      teacherId: 'TCH0001',
      teacherName: 'Mrs. Sarah Jenkins',
      subject: 'Mathematics',
      startDate: '2026-11-08',
      endDate: '2026-11-09',
      reason: 'Attending Regional CBSE Mathematics Pedagogy Symposium.',
      status: 'PENDING',
      substituteTeacherId: 'TCH0004',
      substituteTeacherName: 'Mr. David Vance'
    }
  ],
  marksEntries: [
    {
      id: 'marks_math_10a',
      classId: 'Grade 10-A',
      subject: 'Mathematics',
      teacherId: 'TCH0001',
      teacherName: 'Mrs. Sarah Jenkins',
      status: 'DRAFT', // Can be SUBMITTED -> APPROVED -> PUBLISHED
      isPublishedToStudents: false,
      principalApprovalStatus: 'PENDING',
      studentMarks: [
        { studentId: 'GVS-2027-0001', studentName: 'Aarav Sharma', rollNo: 18, score: 96, maxScore: 100, isAbsent: false },
        { studentId: 'GVS-2027-0002', studentName: 'Aadhya Patel', rollNo: 1, score: 94, maxScore: 100, isAbsent: false },
        { studentId: 'GVS-2027-0003', studentName: 'Aditya Nair', rollNo: 2, score: 88, maxScore: 100, isAbsent: false },
        { studentId: 'GVS-2027-0004', studentName: 'Devansh Reddy', rollNo: 5, score: 0, maxScore: 100, isAbsent: true }
      ]
    }
  ],
  reportCards: [
    {
      studentId: 'GVS-2027-0001',
      studentName: 'Aarav Sharma',
      grade: 'Grade 10',
      section: 'A',
      status: 'DRAFT', // DRAFT -> PENDING -> APPROVED -> PUBLISHED
      overallPercentage: 92.4,
      conductRemarks: 'Exemplary intellectual diligence and analytical problem-solving curiosity.',
      principalSignature: false,
      isPublished: false
    }
  ],
  fees: {
    studentId: 'GVS-2027-0001',
    totalAnnualFee: 48000,
    paidAmount: 36000,
    pendingAmount: 12000,
    hasOutstandingPastDueDate: true,
    hallTicketCleared: false, // Will become true once pending is paid or override
    transactions: [
      {
        id: 'tx_01',
        receiptNo: 'FS-2026-904',
        amount: 24000,
        date: '10 Aug 2026',
        method: 'NetBanking (HDFC)',
        status: 'COMPLETED',
        instalment: 'Term 1 Tuition'
      },
      {
        id: 'tx_02',
        receiptNo: 'FS-2026-442',
        amount: 12000,
        date: '15 Sep 2026',
        method: 'Credit Card',
        status: 'COMPLETED',
        instalment: 'STEM Labs & Tech Fee'
      }
    ]
  },
  hallTickets: [
    {
      studentId: 'GVS-2027-0001',
      studentName: 'Aarav Sharma',
      grade: 'Grade 10',
      examName: 'Mid-Year Comprehensive Examination 2026',
      feeCleared: false,
      attendanceQualified: true,
      classTeacherReleased: false,
      principalOverride: false,
      hallTicketNumber: 'HT-2026-10A-18'
    }
  ],
  transportRequests: [
    {
      id: 'tr_301',
      studentId: 'GVS-2027-0001',
      studentName: 'Aarav Sharma',
      currentRoute: 'Route 4 (North Enclave - Pinecrest)',
      requestedRoute: 'Route 7 (Express Metro Link)',
      reason: 'Change in family residential commute post semester.',
      status: 'PENDING'
    }
  ],
  complaints: [
    {
      id: 'cmp_401',
      studentId: 'GVS-2027-0001',
      parentName: 'Dr. Rajesh Sharma',
      category: 'TRANSPORT',
      subject: 'Morning Bus Route 4 Arriving 15 Minutes Late on Ring Road',
      description: 'Morning bus consistently encounters bottleneck at North Gate bypass leading to tardiness.',
      status: 'ACTIVE',
      isEscalatedToPrincipal: false,
      responses: [
        {
          author: 'Operations Admin (Arthur Pendelton)',
          role: 'Transport Lead',
          message: 'Route dispatch team has rescheduled departure time by 10 minutes earlier from origin starting Monday.',
          timestamp: '28 Oct 2026'
        }
      ],
      parentConfirmedResolved: false
    }
  ],
  configs: [
    {
      id: 'cfg_501',
      title: 'Term 2 Academic Master Schedule & Examination Matrix',
      type: 'ACADEMIC_CALENDAR',
      version: 'v2.4-RELEASE',
      status: 'PENDING', // PENDING -> APPROVED -> ACTIVE
      submittedByAdmin: 'Arthur Pendelton',
      executedByAdmin: false
    }
  ]
};

class WorkflowStoreManager {
  private state: WorkflowState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): WorkflowState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('futureschool_master_workflow_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.fees) {
          if (parsed.fees.pendingAmount === undefined && parsed.fees.pendingamount !== undefined) {
            parsed.fees.pendingAmount = parsed.fees.pendingamount === 120000 ? 12000 : parsed.fees.pendingamount;
          }
          if (parsed.fees.pendingAmount === undefined || parsed.fees.pendingAmount === 120000) {
            parsed.fees.pendingAmount = 12000;
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load workflow state, resetting to default', e);
    }
    return DEFAULT_STATE;
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.listeners.forEach(fn => fn());
    } catch (e) {
      console.error('Failed to save workflow state', e);
    }
  }

  public getState(): WorkflowState {
    return this.state;
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // Workflow Action 1: Parent Leave Approval
  public approveParentLeave(leaveId: string, reviewedBy: string, comment?: string): void {
    this.state.leaveRequests = this.state.leaveRequests.map(item => {
      if (item.id === leaveId) {
        return {
          ...item,
          status: 'APPROVED',
          reviewedBy,
          reviewComment: comment || 'Sanctioned by Class Mentor'
        };
      }
      return item;
    });
    this.saveState();
  }

  public submitParentLeave(leave: Omit<LeaveRequestWorkflow, 'id' | 'status' | 'appliedDate'>): void {
    const newLeave: LeaveRequestWorkflow = {
      ...leave,
      id: 'leave_' + Date.now(),
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    this.state.leaveRequests.unshift(newLeave);
    this.saveState();
  }

  // Workflow Action 2: Marks Submission & Report Card Pipeline
  public saveDraftMarks(classId: string, subject: string, updatedMarks: MarksEntryWorkflow['studentMarks']): void {
    this.state.marksEntries = this.state.marksEntries.map(m => {
      if (m.classId === classId && m.subject === subject) {
        return { ...m, studentMarks: updatedMarks };
      }
      return m;
    });
    this.saveState();
  }

  public submitMarksForVerification(classId: string, subject: string, updatedMarks?: MarksEntryWorkflow['studentMarks']): void {
    this.state.marksEntries = this.state.marksEntries.map(m => {
      if (m.classId === classId && m.subject === subject) {
        return { 
          ...m, 
          status: 'PENDING', 
          principalApprovalStatus: 'PENDING',
          studentMarks: updatedMarks || m.studentMarks
        };
      }
      return m;
    });
    this.saveState();
  }

  public principalApproveMarks(classId: string, subject: string): void {
    this.state.marksEntries = this.state.marksEntries.map(m => {
      if (m.classId === classId && m.subject === subject) {
        return { ...m, status: 'APPROVED', principalApprovalStatus: 'APPROVED' };
      }
      return m;
    });
    this.saveState();
  }

  public principalReturnMarks(classId: string, subject: string, reason: string): void {
    this.state.marksEntries = this.state.marksEntries.map(m => {
      if (m.classId === classId && m.subject === subject) {
        return { ...m, status: 'RETURNED', principalApprovalStatus: 'RETURNED', returnReason: reason };
      }
      return m;
    });
    this.saveState();
  }

  public principalApproveReportCards(): void {
    this.state.reportCards = this.state.reportCards.map(rc => ({
      ...rc,
      status: 'APPROVED',
      principalSignature: true
    }));
    this.saveState();
  }

  public classTeacherPublishReportCards(): void {
    this.state.reportCards = this.state.reportCards.map(rc => ({
      ...rc,
      status: 'PUBLISHED',
      isPublished: true
    }));
    this.state.marksEntries = this.state.marksEntries.map(m => ({
      ...m,
      isPublishedToStudents: true
    }));
    this.saveState();
  }

  // Workflow Action 3: Fee Payment & Hall Ticket Release
  public processFeePayment(amount: number, method: string): void {
    const newPaid = this.state.fees.paidAmount + amount;
    const newPending = Math.max(0, this.state.fees.pendingAmount - amount);
    const receiptNo = `FS-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    this.state.fees = {
      ...this.state.fees,
      paidAmount: newPaid,
      pendingAmount: newPending,
      hasOutstandingPastDueDate: newPending > 0,
      hallTicketCleared: newPending <= 0,
      transactions: [
        {
          id: 'tx_' + Date.now(),
          receiptNo,
          amount,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          method,
          status: 'COMPLETED',
          instalment: 'Term 2 Outstanding Clearance'
        },
        ...this.state.fees.transactions
      ]
    };

    // Update Hall Ticket eligibility
    this.state.hallTickets = this.state.hallTickets.map(ht => ({
      ...ht,
      feeCleared: newPending <= 0
    }));

    this.saveState();
  }

  public classTeacherReleaseHallTicket(studentId: string): void {
    this.state.hallTickets = this.state.hallTickets.map(ht => {
      if (ht.studentId === studentId) {
        return {
          ...ht,
          classTeacherReleased: true,
          releaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return ht;
    });
    this.saveState();
  }

  public principalOverrideHallTicket(studentId: string, reason: string): void {
    this.state.hallTickets = this.state.hallTickets.map(ht => {
      if (ht.studentId === studentId) {
        return {
          ...ht,
          principalOverride: true,
          classTeacherReleased: true,
          releaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return ht;
    });
    this.saveState();
  }

  // Workflow Action 4: Transport Change Request
  public submitTransportChange(req: Omit<TransportChangeWorkflow, 'id' | 'status' | 'appliedDate'>): void {
    const newReq: TransportChangeWorkflow = {
      ...req,
      id: 'trans_' + Date.now(),
      status: 'PENDING',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    this.state.transportRequests.unshift(newReq);
    this.saveState();
  }

  public approveTransportChange(requestId: string, adminNote?: string): void {
    this.state.transportRequests = this.state.transportRequests.map(tr => {
      if (tr.id === requestId) {
        return {
          ...tr,
          status: 'APPROVED',
          adminNote: adminNote || 'Allocated Route 7 Seat 14. Adjusting term pass.'
        };
      }
      return tr;
    });
    this.saveState();
  }

  // Workflow Action 5: Complaints & Resolution
  public submitComplaint(complaint: Omit<ComplaintWorkflow, 'id' | 'status' | 'isEscalatedToPrincipal' | 'responses' | 'parentConfirmedResolved'>): void {
    const newComplaint: ComplaintWorkflow = {
      ...complaint,
      id: 'cmp_' + Date.now(),
      status: 'PENDING',
      isEscalatedToPrincipal: false,
      responses: [],
      parentConfirmedResolved: false
    };
    this.state.complaints.unshift(newComplaint);
    this.saveState();
  }

  public escalateComplaintToPrincipal(complaintId: string): void {
    this.state.complaints = this.state.complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          isEscalatedToPrincipal: true,
          responses: [
            ...c.responses,
            {
              author: 'Dr. Robert Vance (Principal)',
              role: 'Executive Directorate',
              message: 'Reviewed safety report with District Transport Authority. Route re-timed permanently.',
              timestamp: new Date().toLocaleDateString('en-GB')
            }
          ]
        };
      }
      return c;
    });
    this.saveState();
  }

  public resolveComplaint(complaintId: string): void {
    this.state.complaints = this.state.complaints.map(c => {
      if (c.id === complaintId) {
        return { ...c, status: 'RESOLVED', parentConfirmedResolved: true };
      }
      return c;
    });
    this.saveState();
  }

  // Workflow Action 6: Teacher Leave & Substitution
  public approveTeacherLeave(leaveId: string, substituteTeacherName: string): void {
    this.state.teacherLeaves = this.state.teacherLeaves.map(tl => {
      if (tl.id === leaveId) {
        return {
          ...tl,
          status: 'APPROVED',
          substituteTeacherName,
          principalComment: 'Approved. Substitution allocated.'
        };
      }
      return tl;
    });
    this.saveState();
  }

  // Workflow Action 7: Admin Config & Principal Sign-off
  public principalApproveConfig(configId: string): void {
    this.state.configs = this.state.configs.map(cfg => {
      if (cfg.id === configId) {
        return {
          ...cfg,
          status: 'APPROVED',
          principalSignoff: 'Dr. Robert Vance (Executive Signoff)'
        };
      }
      return cfg;
    });
    this.saveState();
  }

  public adminExecuteConfig(configId: string): void {
    this.state.configs = this.state.configs.map(cfg => {
      if (cfg.id === configId) {
        return { ...cfg, status: 'ACTIVE', executedByAdmin: true };
      }
      return cfg;
    });
    this.saveState();
  }

  // Demo Reset
  public resetToDefault(): void {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  // Fast-Forward Scenario
  public applyScenario(scenarioNumber: number): void {
    switch (scenarioNumber) {
      case 1: // Parent Leave -> Approved
        this.approveParentLeave('leave_101', 'Mrs. Sarah Jenkins', 'Leave sanctioned for medical recovery.');
        break;
      case 2: // Marks -> Principal Approved -> Class Teacher Published
        this.principalApproveMarks('Grade 10-A', 'Mathematics');
        this.principalApproveReportCards();
        this.classTeacherPublishReportCards();
        break;
      case 3: // Fee Paid -> Hall Ticket Released
        this.processFeePayment(1200, 'Online Demo Payment');
        this.classTeacherReleaseHallTicket('GVS-2027-0001');
        break;
      case 4: // Transport Approved
        this.approveTransportChange('tr_301', 'Approved Route 7 Express Link.');
        break;
      case 5: // Complaint Escalated & Resolved
        this.escalateComplaintToPrincipal('cmp_401');
        this.resolveComplaint('cmp_401');
        break;
      case 6: // Teacher Leave Approved
        this.approveTeacherLeave('tch_leave_201', 'Prof. David Vance');
        break;
      case 7: // Config Approved & Executed
        this.principalApproveConfig('cfg_501');
        this.adminExecuteConfig('cfg_501');
        break;
      default:
        this.resetToDefault();
    }
  }
}

export const workflowStore = new WorkflowStoreManager();
