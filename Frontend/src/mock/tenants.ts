/**
 * FutureSchool - Multi-Tenant Registry & Subscription Definitions
 */

import { SchoolTenant, SubscriptionPlanDefinition } from '../types/tenant';

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlanDefinition> = {
  STARTER: {
    tier: 'STARTER',
    displayName: 'Starter School',
    description: 'Essential school management for developing schools up to 500 students',
    baseStudentCapacity: 500,
    entitlements: {
      maxStudents: 500,
      coreAcademics: true,
      attendanceAndTimetable: true,
      homeworkAndQuizzes: true,
      feesAndInvoicing: true,
      fleetTransport: false,
      aiTutorStudent: false,
      aiLessonPlannerTeacher: false,
      aiExecutiveBriefPrincipal: false,
      smsWhatsappAlerts: false,
      customDomainSupport: false,
      auditRetentionDays: 90,
      dedicatedAccountManager: false,
    },
    highlightFeatures: ['Core Gradebook & Attendance', 'Homework & Basic Quizzes', 'Standard Invoicing', '90-Day Audit Log']
  },
  STANDARD: {
    tier: 'STANDARD',
    displayName: 'Standard Campus',
    description: 'Comprehensive academic and operations suite for schools up to 1,000 students',
    baseStudentCapacity: 1000,
    entitlements: {
      maxStudents: 1000,
      coreAcademics: true,
      attendanceAndTimetable: true,
      homeworkAndQuizzes: true,
      feesAndInvoicing: true,
      fleetTransport: true,
      aiTutorStudent: true,
      aiLessonPlannerTeacher: true,
      aiExecutiveBriefPrincipal: false,
      smsWhatsappAlerts: true,
      customDomainSupport: false,
      auditRetentionDays: 365,
      dedicatedAccountManager: false,
    },
    highlightFeatures: ['Fleet Bus Transport Operations', 'Student AI Tutor & Teacher Planner', 'SMS & WhatsApp Notifications', '1-Year Audit Retention']
  },
  PRO: {
    tier: 'PRO',
    displayName: 'Professional Academy',
    description: 'Advanced intelligence, automated scheduling, and full safety tracking for up to 2,000 students',
    baseStudentCapacity: 2000,
    entitlements: {
      maxStudents: 2000,
      coreAcademics: true,
      attendanceAndTimetable: true,
      homeworkAndQuizzes: true,
      feesAndInvoicing: true,
      fleetTransport: true,
      aiTutorStudent: true,
      aiLessonPlannerTeacher: true,
      aiExecutiveBriefPrincipal: true,
      smsWhatsappAlerts: true,
      customDomainSupport: true,
      auditRetentionDays: 730,
      dedicatedAccountManager: true,
    },
    highlightFeatures: ['Leadership AI Executive Briefs', 'Assisted Timetable Conflict Engine', 'Custom School Subdomain', '2-Year Audit History']
  },
  ENTERPRISE: {
    tier: 'ENTERPRISE',
    displayName: 'Enterprise Multi-Campus',
    description: 'Bespoke infrastructure, unlimited audit trails, and multi-branch federation for 3,000+ students',
    baseStudentCapacity: 5000,
    entitlements: {
      maxStudents: 5000,
      coreAcademics: true,
      attendanceAndTimetable: true,
      homeworkAndQuizzes: true,
      feesAndInvoicing: true,
      fleetTransport: true,
      aiTutorStudent: true,
      aiLessonPlannerTeacher: true,
      aiExecutiveBriefPrincipal: true,
      smsWhatsappAlerts: true,
      customDomainSupport: true,
      auditRetentionDays: 1825,
      dedicatedAccountManager: true,
    },
    highlightFeatures: ['Multi-Campus Federation', 'Institutional Data Lake & BI Connector', 'Dedicated Enterprise SLA', '5-Year Immutable Audit Trail']
  }
};

export const INITIAL_TENANTS: SchoolTenant[] = [
  {
    id: 'GVS',
    code: 'GVS-BLR-01',
    name: 'Greenwood Valley School',
    tagline: 'Excellence in Holistic Education',
    affiliationNumber: 'CBSE-AFF-2026/89410',
    board: 'CBSE',
    status: 'ACTIVE',
    subscriptionTier: 'STANDARD',
    entitlements: SUBSCRIPTION_PLANS.STANDARD.entitlements,
    currentEnrolledStudents: 604,
    capacityLimit: 640,
    principalName: 'Dr. Robert Vance',
    principalEmail: 'principal.vance@futureschool.edu',
    adminName: 'Arthur Pendelton',
    adminEmail: 'admin.ops@futureschool.edu',
    contactPhone: '+91 80 2844 9100',
    address: {
      street: 'Plot 42, HSR Sector 2, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560102',
      country: 'India'
    },
    onboardedAt: '2026-06-01',
    verifiedAt: '2026-06-05',
    subscriptionRenewsAt: '2027-06-01'
  },
  {
    id: 'OAK',
    code: 'OAK-HYD-04',
    name: 'Oakridge International Academy',
    tagline: 'Nurturing Global Inquirers',
    affiliationNumber: 'IB-WORLD-04921',
    board: 'IB',
    status: 'ACTIVE',
    subscriptionTier: 'ENTERPRISE',
    entitlements: SUBSCRIPTION_PLANS.ENTERPRISE.entitlements,
    currentEnrolledStudents: 820,
    capacityLimit: 1000,
    principalName: 'Dr. Alistair Finch',
    principalEmail: 'principal@oakridge-intl.edu',
    adminName: 'Sunita Reddy',
    adminEmail: 'admin@oakridge-intl.edu',
    contactPhone: '+91 40 6890 2200',
    address: {
      street: 'Gachibowli Financial District',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500032',
      country: 'India'
    },
    onboardedAt: '2026-04-15',
    verifiedAt: '2026-04-18',
    subscriptionRenewsAt: '2027-04-15'
  },
  {
    id: 'DPS',
    code: 'DPS-DEL-02',
    name: 'Delhi Public Heritage High',
    tagline: 'Service Before Self',
    affiliationNumber: 'CBSE-DEL-10294',
    board: 'CBSE',
    status: 'PENDING_VERIFICATION',
    subscriptionTier: 'STARTER',
    entitlements: SUBSCRIPTION_PLANS.STARTER.entitlements,
    currentEnrolledStudents: 450,
    capacityLimit: 500,
    principalName: 'Meenakshi Sundaram',
    principalEmail: 'principal@dps-heritage.edu',
    adminName: 'Rajesh Bakshi',
    adminEmail: 'admin@dps-heritage.edu',
    contactPhone: '+91 11 2610 4400',
    address: {
      street: 'Sector 14, R.K. Puram',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110022',
      country: 'India'
    },
    onboardedAt: '2026-10-28',
    subscriptionRenewsAt: '2027-10-28'
  }
];
