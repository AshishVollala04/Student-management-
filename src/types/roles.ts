export type UserRole = 'STUDENT' | 'PARENT' | 'TEACHER' | 'PRINCIPAL' | 'ADMIN';

export type AdminPermission = 
  | 'ADMISSIONS'
  | 'FINANCE'
  | 'ACADEMIC_OPERATIONS'
  | 'TRANSPORT'
  | 'SECURITY'
  | 'REPORTS';

export type AdminRoleProfile = 
  | 'FULL_ADMIN'
  | 'ADMISSIONS_ADMIN'
  | 'FINANCE_ADMIN'
  | 'TRANSPORT_ADMIN'
  | 'SECURITY_ADMIN';

export type WorkflowStatus = 
  | 'DRAFT'
  | 'PENDING'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'BLOCKED'
  | 'PUBLISHED'
  | 'RESOLVED'
  | 'EXECUTED';

export interface UserProfile {
  id: string;             // e.g. GVS-2027-0001, TCH0001, PRN0001, ADM0001
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  roleLabel: string;
  department?: string;
  studentId?: string;     // For Student and Parent
  classTeacherOf?: string; // For Teacher (e.g. "Grade 10-A")
  permissions?: AdminPermission[];
  requiresMfa?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  badgeColor?: 'teal' | 'orange' | 'rose' | 'slate';
  category?: string;
  requiredPermission?: AdminPermission;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
