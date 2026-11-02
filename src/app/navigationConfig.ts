import { NavGroup, UserRole } from '../types/roles';

export const ROLE_NAVIGATION: Record<UserRole, NavGroup[]> = {
  STUDENT: [
    {
      title: 'Academic Core',
      items: [
        { id: 's_dash', label: 'Dashboard', path: '/student/dashboard', iconName: 'LayoutDashboard' },
        { id: 's_acad', label: 'My Academics', path: '/student/academics', iconName: 'GraduationCap' },
        { id: 's_att', label: 'Attendance', path: '/student/attendance', iconName: 'CalendarCheck' },
        { id: 's_time', label: 'Weekly Timetable', path: '/student/timetable', iconName: 'Clock' },
        { id: 's_prog', label: 'My Progress', path: '/student/progress', iconName: 'TrendingUp' }
      ]
    },
    {
      title: 'Learning & Tasks',
      items: [
        { id: 's_hw', label: 'Homework & Tasks', path: '/student/homework', iconName: 'BookOpen', badge: 2, badgeColor: 'orange' },
        { id: 's_quiz', label: 'Quiz Practice', path: '/student/quiz', iconName: 'CheckSquare' },
        { id: 's_mat', label: 'Study Materials', path: '/student/materials', iconName: 'FileText' },
        { id: 's_lib', label: 'Digital Library', path: '/student/library', iconName: 'Library' },
        { id: 's_ai', label: 'AI Study Tutor (Mock)', path: '/student/ai-tutor', iconName: 'Sparkles', badgeColor: 'teal' }
      ]
    },
    {
      title: 'Examinations & Profile',
      items: [
        { id: 's_exam', label: 'Exams & Schedule', path: '/student/exams', iconName: 'Award' },
        { id: 's_ht', label: 'Hall Ticket', path: '/student/hall-ticket', iconName: 'FileCheck' },
        { id: 's_prof', label: 'Profile & Security', path: '/student/profile', iconName: 'User' }
      ]
    }
  ],

  PARENT: [
    {
      title: 'Action & Safety',
      items: [
        { id: 'p_dash', label: 'Action Center', path: '/parent/dashboard', iconName: 'LayoutDashboard' },
        { id: 'p_ov', label: 'Child Overview', path: '/parent/overview', iconName: 'UserCheck' },
        { id: 'p_att', label: 'Attendance & Alerts', path: '/parent/attendance', iconName: 'CalendarCheck' },
        { id: 'p_trans', label: 'Bus Route & Safety', path: '/parent/transport', iconName: 'Bus' },
        { id: 'p_pick', label: 'Pickup Authorizations', path: '/parent/pickup', iconName: 'ShieldAlert' }
      ]
    },
    {
      title: 'Academics & Reports',
      items: [
        { id: 'p_acad', label: 'Academic Reports', path: '/parent/academics', iconName: 'GraduationCap' },
        { id: 'p_hw', label: 'Homework Tracking', path: '/parent/homework', iconName: 'BookOpen' },
        { id: 'p_time', label: 'Class Timetable', path: '/parent/timetable', iconName: 'Clock' },
        { id: 'p_exam', label: 'Exams & Hall Ticket', path: '/parent/exams', iconName: 'Award' }
      ]
    },
    {
      title: 'Finance & School Liaison',
      items: [
        { id: 'p_fee', label: 'Fees & Checkout', path: '/parent/fees', iconName: 'CreditCard', badge: '$1,200', badgeColor: 'rose' },
        { id: 'p_leave', label: 'Apply Leave', path: '/parent/leave', iconName: 'FileQuestion' },
        { id: 'p_msg', label: 'Teacher Messages', path: '/parent/messages', iconName: 'MessageSquare' },
        { id: 'p_meet', label: 'PTM Consultation', path: '/parent/meetings', iconName: 'Users' },
        { id: 'p_cmp', label: 'Complaints Center', path: '/parent/complaints', iconName: 'AlertCircle' },
        { id: 'p_con', label: 'Consent Forms', path: '/parent/consent', iconName: 'FileCheck2' },
        { id: 'p_prof', label: 'Profile & Settings', path: '/parent/profile', iconName: 'Settings' }
      ]
    }
  ],

  TEACHER: [
    {
      title: 'My Teaching (Subject)',
      items: [
        { id: 't_dash', label: 'Faculty Dashboard', path: '/teacher/dashboard', iconName: 'LayoutDashboard' },
        { id: 't_cls', label: 'Assigned Classes', path: '/teacher/classes', iconName: 'BookMarked' },
        { id: 't_hw', label: 'Homework Manager', path: '/teacher/homework', iconName: 'BookOpen' },
        { id: 't_mrk', label: 'Marks Web Grid', path: '/teacher/marks', iconName: 'CheckSquare' },
        { id: 't_qzb', label: 'Quiz Builder', path: '/teacher/quiz-builder', iconName: 'FileSpreadsheet' },
        { id: 't_mat', label: 'Study Materials', path: '/teacher/materials', iconName: 'UploadCloud' },
        { id: 't_pln', label: 'Lesson Planner', path: '/teacher/planner', iconName: 'Calendar' }
      ]
    },
    {
      title: 'Class Mentor (10-A)',
      items: [
        { id: 't_att', label: 'Morning/Noon Attendance', path: '/teacher/attendance', iconName: 'CalendarCheck' },
        { id: 't_lvr', label: 'Parent Leave Requests', path: '/teacher/leave-requests', iconName: 'Clock', badge: 1, badgeColor: 'orange' },
        { id: 't_rc', label: 'Report Card Prep', path: '/teacher/report-cards', iconName: 'FileCheck' },
        { id: 't_ht', label: 'Hall Ticket Clearance', path: '/teacher/hall-tickets', iconName: 'ShieldCheck' },
        { id: 't_msg', label: 'Parent Messages & PTM', path: '/teacher/messages', iconName: 'MessageSquare' }
      ]
    }
  ],

  PRINCIPAL: [
    {
      title: 'Executive Governance',
      items: [
        { id: 'pr_dash', label: 'Executive Dashboard', path: '/principal/dashboard', iconName: 'LayoutDashboard' },
        { id: 'pr_appr', label: 'Approval Queue', path: '/principal/approvals', iconName: 'CheckCircle2', badge: 3, badgeColor: 'orange' },
        { id: 'pr_rc', label: 'Report Card Approvals', path: '/principal/report-cards', iconName: 'Award' },
        { id: 'pr_tl', label: 'Teacher Leave Approval', path: '/principal/teacher-leave', iconName: 'Users' },
        { id: 'pr_rex', label: 'Re-Exam Approvals', path: '/principal/re-exams', iconName: 'FileQuestion' },
        { id: 'pr_fee', label: 'Fee Concessions', path: '/principal/fee-approvals', iconName: 'CreditCard' }
      ]
    },
    {
      title: 'Campus Control',
      items: [
        { id: 'pr_cov', label: 'Teacher Coverage Center', path: '/principal/coverage', iconName: 'Calendar' },
        { id: 'pr_exc', label: 'Exam Control Center', path: '/principal/exam-control', iconName: 'ShieldAlert' },
        { id: 'pr_cmp', label: 'Safety & Incidents', path: '/principal/complaints', iconName: 'AlertTriangle' },
        { id: 'pr_del', label: 'Acting Delegation', path: '/principal/delegation', iconName: 'UserCheck' },
        { id: 'pr_ai', label: 'Leadership AI Brief', path: '/principal/ai-summary', iconName: 'Sparkles', badgeColor: 'teal' }
      ]
    }
  ],

  ADMIN: [
    {
      title: 'Operations Center',
      items: [
        { id: 'a_dash', label: 'Operations Dashboard', path: '/admin/dashboard', iconName: 'LayoutDashboard' },
        { id: 'a_queue', label: 'Execution Queue', path: '/admin/execution-queue', iconName: 'ListOrdered', badge: 1, badgeColor: 'teal' },
        { id: 'a_struct', label: 'Academic Structure', path: '/admin/academic-structure', iconName: 'Building2', requiredPermission: 'ACADEMIC_OPERATIONS' },
        { id: 'a_adm', label: 'Admissions Wizard', path: '/admin/admissions', iconName: 'UserPlus', requiredPermission: 'ADMISSIONS' },
        { id: 'a_staff', label: 'Staff Onboarding', path: '/admin/staff', iconName: 'Briefcase' }
      ]
    },
    {
      title: 'Finance & Logistics',
      items: [
        { id: 'a_fee', label: 'Fee Structure & Ledger', path: '/admin/fees', iconName: 'CreditCard', requiredPermission: 'FINANCE' },
        { id: 'a_bill', label: 'Billing Run Center', path: '/admin/billing', iconName: 'Receipt', requiredPermission: 'FINANCE' },
        { id: 'a_trans', label: 'Transport Operations', path: '/admin/transport', iconName: 'Bus', requiredPermission: 'TRANSPORT' },
        { id: 'a_time', label: 'Timetable Generator', path: '/admin/timetable-generator', iconName: 'Clock', requiredPermission: 'ACADEMIC_OPERATIONS' }
      ]
    },
    {
      title: 'Administration & Control',
      items: [
        { id: 'a_stu', label: 'Student 360 Directory', path: '/admin/students', iconName: 'Users' },
        { id: 'a_perm', label: 'Admin Permissions', path: '/admin/permissions', iconName: 'Key', requiredPermission: 'SECURITY' },
        { id: 'a_imp', label: 'Bulk Import / Migration', path: '/admin/bulk-import', iconName: 'Upload' },
        { id: 'a_aud', label: 'Audit & Health Center', path: '/admin/audit', iconName: 'ShieldCheck', requiredPermission: 'REPORTS' }
      ]
    }
  ]
};
