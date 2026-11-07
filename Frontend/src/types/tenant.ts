/**
 * FutureSchool - Multi-Tenant Domain Types
 * Defines the SaaS Platform Layer, School Tenants, and Subscription Entitlements
 */

export type SubscriptionTier = 'STARTER' | 'STANDARD' | 'PRO' | 'ENTERPRISE';

export type TenantStatus = 
  | 'PENDING_VERIFICATION' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'EXPIRED';

export type EducationalBoard = 'CBSE' | 'ICSE' | 'IB' | 'CAMBRIDGE' | 'STATE_BOARD';

export interface FeatureEntitlements {
  maxStudents: number;
  coreAcademics: boolean;
  attendanceAndTimetable: boolean;
  homeworkAndQuizzes: boolean;
  feesAndInvoicing: boolean;
  fleetTransport: boolean;
  aiTutorStudent: boolean;
  aiLessonPlannerTeacher: boolean;
  aiExecutiveBriefPrincipal: boolean;
  smsWhatsappAlerts: boolean;
  customDomainSupport: boolean;
  auditRetentionDays: number;
  dedicatedAccountManager: boolean;
}

export interface SchoolTenant {
  id: string;               // e.g., 'GVS', 'OAK', 'DPS'
  code: string;             // e.g., 'GVS-BLR'
  name: string;             // e.g., 'Greenwood Valley School'
  tagline: string;
  affiliationNumber: string; // e.g., 'CBSE-AFF-2026/89410'
  board: EducationalBoard;
  status: TenantStatus;
  subscriptionTier: SubscriptionTier;
  entitlements: FeatureEntitlements;
  currentEnrolledStudents: number;
  capacityLimit: number;
  principalName: string;
  principalEmail: string;
  adminName: string;
  adminEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  onboardedAt: string;
  verifiedAt?: string;
  subscriptionRenewsAt: string;
}

export interface SubscriptionPlanDefinition {
  tier: SubscriptionTier;
  displayName: string;
  description: string;
  baseStudentCapacity: number;
  entitlements: FeatureEntitlements;
  highlightFeatures: string[];
}
